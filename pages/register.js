.wheel {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 1px solid black;
  overflow: hidden;
  
  background-image: conic-gradient(red 16.67%, green 0 33.33%, blue 0 50%, yellow 0 66.67%, cyan 0 83.33%, orange 0);
}

.arrow {
  background-color: black;
  width: 10px;
  height: 10px;
  position: absolute;
  left: 225px;
  top: 100px;
}

.spin {
  margin-top: 20px;
}

.result {
  margin-top: 10px;
  width: 20px;
  height: 20px;
  border: 1px solid black;
}

.rotating {
  transition: all 3s;
  transition-timing: ease-in-out;
}
