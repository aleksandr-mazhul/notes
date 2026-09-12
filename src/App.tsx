import type { Note } from './types';
import {useState} from "react";

function App() {
  const [note ] = useState<Note[]>([{
    title: 'My First Note',
    content: 'This is the content of my first note.',
    createdAt: new Date(),
    hidden: false
  }]);

  return (
    <div className="App">

      <header className="App-header">
        <h1>Welcome to My App</h1>
      </header>
    </div>
  );
}

export default App
