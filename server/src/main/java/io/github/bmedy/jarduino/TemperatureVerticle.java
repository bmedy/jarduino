package io.github.bmedy.jarduino;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.eventbus.DeliveryOptions;
import io.vertx.core.json.JsonObject;

import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.logging.Logger;

/**
 * Created by medy on 8/6/16.
 */
public class TemperatureVerticle extends AbstractVerticle{

    private Logger log = Logger.getLogger(this.getClass().getName());

    @Override
    public void start() throws Exception {
        log.info("log de test");
        vertx.eventBus().consumer("temperature.log", response -> {
            log.info("log temperature");
            log.info("with body : "+response.body());
            DeliveryOptions options = new DeliveryOptions();
            options.addHeader("type", "temperature");

            JsonObject temperature = new JsonObject().put("value", response.body()).put("date", ZonedDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
            vertx.eventBus().send("temperature.UI", temperature, options);
            vertx.eventBus().send("Database.write", temperature, options);
        });

        vertx.eventBus().consumer("temperature.fetch", response -> {
            // delegate to database verticle
            log.info("received message to topic temperature.fetch with body : "+response.body());
            DeliveryOptions options = new DeliveryOptions();
            options.addHeader("type", "temperature");
            options.addHeader("responseTopic", "temperature.UI");
            vertx.eventBus().send("Database.fetch", null, options);
        });
    }
}
