package io.github.bmedy.jarduino;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;

import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.logging.Logger;

/**
 * Created by medy on 6/26/16.
 */
public class DatabaseVerticle extends AbstractVerticle {
    private Logger log = Logger.getLogger(this.getClass().getName());

    MongoClient mongoClient;

    @Override
    public void start() throws Exception {
        JsonObject config = new JsonObject();
        config.put("connection_string", config().getString("connection-string", "mongodb://localhost:27017"));
        config.put("db_name", config().getString("connection-string", "jarduino"));

        this.mongoClient = MongoClient.createShared(vertx, config);

        vertx.eventBus().consumer("Database.write", response -> {
            log.info("write message to database");
            String type = response.headers().get("type");
            if(type == null){
                throw new IllegalArgumentException("Database.Write topic require header \"type\" with component name as value");
            }
            log.info("to collection : "+type);
            log.info("with body : "+response.body());

            JsonObject document = (JsonObject) response.body();
            mongoClient.save(type,document, res -> {
                if (res.succeeded()) {
                    String id = res.result();
                    System.out.println("Saved "+ type +"with id " + id);
                    response.reply(id);
                } else {
                    res.cause().printStackTrace();
                }
            });
        });

        vertx.eventBus().consumer("Database.fetch", response -> {
            String type = response.headers().get("type");
            String responseTopic = response.headers().get("responseTopic");
            log.info("received message to topic Database.fetch collection ["+type +"] with body : ["+response.body()+"] and reply to ["+responseTopic+"]");
            mongoClient.find(type, new JsonObject(), res -> {
                log.info("temperature count " + res.result().size());
                res.result().stream().forEach(o -> vertx.eventBus().send(responseTopic,o));
            });
        });
    }
}
