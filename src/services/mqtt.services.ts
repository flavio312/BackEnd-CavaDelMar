import mqtt from "mqtt";
import Tanque from "../models/tanque.models";

const client = mqtt.connect("mqtt://localhost:1883"); 

client.on("connect", () => {
  console.log("Conectado al broker MQTT");
  client.subscribe("mqtt.topic", (error) => {
    if (!error) {
      console.log("Suscrito al topic: tu_topic_del_tanque");
    } else {
      console.error("Error al suscribirse al topic:", error);
    }
  });
});

client.on("message", async (topic, message) => {
  try {
    const data = JSON.parse(message.toString());
    const { capacidad, temperatura, ph, turbidez_agua, nivel_agua } = data;

    await Tanque.create({
      capacidad,
      temperatura,
      ph,
      turbidez_agua,
      nivel_agua,
    });

    console.log("Datos del tanque guardados en la base de datos:", data);
  } catch (error) {
    console.error("Error al procesar mensaje MQTT:", error);
  }
});

export default client;
