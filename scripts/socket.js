function handleMessage(ns, msg) {
   socket.send(msg)
   ns.print(msg)
}

class Stack {
   constructor(maxSize) { // Set default max size if not provided
      if (isNaN(maxSize)) {
         maxSize = 1000;
      }
      this.maxSize = maxSize; // Init an array that'll contain the stack values.
      this.container = [];
   }
   display() {
      console.log(this.container);
   }
   isEmpty() {
      return this.container.length === 0;
   }
   isFull() {
      return this.container.length >= this.maxSize;
   }
   push(element) { // Check if stack is full
      if (this.isFull()) {
         console.log("Stack Overflow!")
         return
      }
      this.container.push(element)
   }
   pop() { // Check if empty
      if (this.isEmpty()) {
         console.log("Stack Underflow!")
         return
      }
      this.container.pop()
   }
   peek() {
      if (this.isEmpty()) {
         console.log("Stack Underflow!");
         return
      }
      return this.container[this.container.length - 1];
   }
   clear() {
      this.container = [];
   }
}

/** @param {NS} ns */
export async function main(ns) {
   const socket = new WebSocket('ws://localhost:9001');
   const stack = new Stack()

   // Connect
   socket.addEventListener('open', function (event) {
      socket.send('Hello Server!');
   });

   // Handle server messages
   socket.addEventListener('message', function (event) {
      //ns.printf('Message from server %s', event.data);
      stack.push(event.data)
   });

   socket.onclose = function () {
      // Try to reconnect in 5 seconds
      setTimeout(function () { start(websocketServerLocation) }, 5000);
   };

   // To send data, use `socket.send()`
   //socket.send("Hiii! <3")

   while (true) {
      await ns.sleep(100)
      //socket.send("100 milliseconds later!")

      if (!socket.readyState === WebSocket.OPEN) exit();

      if (!stack.isEmpty()) {
         //ns.printf('Msg from server: %s', stack.pop())
         handleMessage(ns, stack.peek())
         stack.pop()
      }
   }
}
