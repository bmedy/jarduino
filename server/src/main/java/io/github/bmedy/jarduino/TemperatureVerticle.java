package io.github.bmedy.jarduino;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.eventbus.DeliveryOptions;

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

            vertx.eventBus().send("temperature.UI", response.body(), options);
            vertx.eventBus().send("Database.write", response.body(), options);
        });

        vertx.eventBus().consumer("temperature.fetch", response -> {
            // delegate to database verticle
            log.info("received message to topic temperature.fetch with body : "+response.body());
            DeliveryOptions options = new DeliveryOptions();
            options.addHeader("type", "temperature");
            vertx.eventBus().send("Database.fetch", null, options, result -> {
                log.info("result database fetch:"+result.succeeded());
                response.reply(result.result().body(),options);
            });
        });
    }
}
