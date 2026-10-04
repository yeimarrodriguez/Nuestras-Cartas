window.CARTAS_CONFIG = {
  receiverName: "Mi amor",
  senderName: "Con amor",
  memories: [
    { title: "Un momento para nosotros", date: "Nuestro recuerdo", image: "", text: "Aquí puedes poner una pequeña historia o descripción." },
    { title: "Otro recuerdo", date: "Un día especial", image: "", text: "Puedes editar esta información desde config.js." },
    { title: "Lo que guardaría para siempre", date: "Sin fecha", image: "", text: "Este espacio queda preparado para tus fotografías." }
  ],
  defaultLetters: [
    {
      id:"welcome", title:"Para ti", date:"Siempre", to:"Mi amor", from:"Con todo mi cariño",
      theme:"burgundy", seal:"heart",
      message:"Hay palabras que uno piensa muchas veces antes de decirlas.\\n\\nEsta pequeña carta es un lugar para dejar todo aquello que a veces no cabe en una conversación.\\n\\nToca el sello de cera al final de la carta. Puede que haya algo escondido.",
      secret:"Si llegaste hasta aquí, entonces leíste hasta el final. Y eso ya me parece bonito."
    },
    {
      id:"secret", title:"Cuando me extrañes", date:"Para abrir cuando quieras", to:"Tú", from:"Siempre cerca",
      theme:"plum", seal:"star",
      message:"Si algún día me extrañas, abre esta carta con calma.\\n\\nNo hace falta que respondas nada. Solo quería dejarte unas palabras que pudieras encontrar cuando necesitaras sentir un poquito de compañía.",
      secret:"No importa qué tan lejos esté una persona cuando todavía existen lugares donde puedes encontrarla."
    }
  ]
};