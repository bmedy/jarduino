package io.github.bmedy.jarduino;

import io.moquette.BrokerConstants;
import io.moquette.interception.AbstractInterceptHandler;
import io.moquette.interception.InterceptHandler;
import io.moquette.interception.messages.InterceptPublishMessage;
import io.moquette.server.Server;
import io.moquette.server.config.IConfig;
import io.moquette.server.config.MemoryConfig;
import io.vertx.core.AbstractVerticle;
import io.vertx.core.eventbus.DeliveryOptions;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Properties;
import java.util.logging.Logger;

/**
 * Created by medy on 6/25/16.
 */
public class MQTTVerticle extends AbstractVerticle {

    private Logger log = Logger.getLogger(this.getClass().getName());

    private IConfig memConfig;
    private Server mqttBroker;
    private List<? extends InterceptHandler> userHandlers;


    public MQTTVerticle() {
        this.mqttBroker = new Server();
    }

    @Override
    public void start() throws Exception {

        Properties props = new Properties();

        // get properties from manifest file
        props.setProperty(BrokerConstants.PORT_PROPERTY_NAME, Integer.toString(config().getInteger("broker-port", 1883)));
        props.setProperty(BrokerConstants.HOST_PROPERTY_NAME, config().getString("broker-host", "0.0.0.0"));

//        props.setProperty(BrokerConstants.PASSWORD_FILE_PROPERTY_NAME, "config/password_file.conf");
//        props.setProperty(BrokerConstants.PERSISTENT_STORE_PROPERTY_NAME, "mqtt-broker/config/moquette_store.mapdb");

        memConfig = new MemoryConfig(props);
        userHandlers = Arrays.asList(new PublisherListener());

        try {
            mqttBroker.startServer(memConfig, userHandlers);
        } catch (IOException ex) {
            //throw new RuntimeException("Plugin can't start for an IOException.", ex);
            //throw new PluginStartupException("Plugin can't start for an IOException.", ex);
        }
        log.info("MQTT broker started");

    }

    @Override
    public void stop() throws Exception {
        this.mqttBroker.stopServer();
    }

    /**
     * This class is used to listen to messages on topics and manage them.
     *
     */
    class PublisherListener extends AbstractInterceptHandler {

        @Override
        public void onPublish(InterceptPublishMessage msg) {
            String topic = msg.getTopicName();
            String value = new String(msg.getPayload().array());
            // TODO add rules to prevent no authorized messages
            log.info("received message to topic : "+topic+"\r\n with body : "+value);
                DeliveryOptions options = new DeliveryOptions();
                options.addHeader("type", topic);

                // To component verticle
                vertx.eventBus().send(topic+".log", value, options);

        }
    }



}
