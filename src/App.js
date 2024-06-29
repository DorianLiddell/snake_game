import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const gridSize = 20;
const canvasSize = 400;

function App() {
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState([{ x: gridSize * 5, y: gridSize * 5 }]);
  const [direction, setDirection] = useState('right');
  const [food, setFood] = useState(generateFood());

  useEffect(() => {
    const handleKeydown = (event) => {
      switch (event.key) {
        case 'ArrowUp':
          if (direction !== 'down') setDirection('up');
          break;
        case 'ArrowDown':
          if (direction !== 'up') setDirection('down');
          break;
        case 'ArrowLeft':
          if (direction !== 'right') setDirection('left');
          break;
        case 'ArrowRight':
          if (direction !== 'left') setDirection('right');
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [direction]);

  useEffect(() => {
    const interval = setInterval(gameLoop, 100);
    return () => clearInterval(interval);
  }, [snake, direction, food]);

  function generateFood() {
    return {
      x: Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize,
      y: Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize,
    };
  }

  function drawSnake(ctx) {
    ctx.fillStyle = 'green';
    snake.forEach((segment) => {
      ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });
  }

  function drawFood(ctx) {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
  }

  function moveSnake() {
    const newSnake = [...snake];
    const head = { ...newSnake[0] };

    switch (direction) {
      case 'up':
        head.y -= gridSize;
        break;
      case 'down':
        head.y += gridSize;
        break;
      case 'left':
        head.x -= gridSize;
        break;
      case 'right':
        head.x += gridSize;
        break;
      default:
        break;
    }

    newSnake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      setFood(generateFood());
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }

  function checkCollision() {
    const head = snake[0];

    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
      return true;
    }

    for (let i = 4; i < snake.length; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y) {
        return true;
      }
    }

    return false;
  }

  function gameLoop() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (checkCollision()) {
      alert('Game Over!');
      setSnake([{ x: gridSize * 5, y: gridSize * 5 }]);
      setDirection('right');
      setFood(generateFood());
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    moveSnake();
    drawSnake(ctx);
    drawFood(ctx);
  }

  return (
    <div className="App">
      <canvas ref={canvasRef} width={canvasSize} height={canvasSize} />
    </div>
  );
}

export default App;
