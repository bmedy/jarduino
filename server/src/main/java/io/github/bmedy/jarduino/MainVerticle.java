package io.github.bmedy.jarduino;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Vertx;
import io.vertx.core.VertxOptions;
import io.vertx.core.json.JsonObject;

/**
 * Created by medy on 6/24/16.
 */
public class MainVerticle extends AbstractVerticle {

    public static void main(String[] args) {

       Vertx.vertx(new VertxOptions().setWorkerPoolSize(40)).deployVerticle(MainVerticle.class.getName());

    }

    @Override
    public void start() throws Exception {
        vertx.deployVerticle(new DatabaseVerticle());
        vertx.deployVerticle(new WebappVerticle());
        vertx.deployVerticle(new MQTTVerticle());
        vertx.deployVerticle(new TemperatureVerticle());
    }
}
