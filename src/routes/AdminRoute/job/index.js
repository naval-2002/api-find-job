const express = require("express");

module.exports = function Job() {
  const api = express.Router();

  api.post("/", (req, res) => {});

  api.get('/get', async (req, res)=>{

  })
  api.put('/get', async (req, res)=>{
    
  })
  api.delete('/get', async (req, res)=>{
    
  })
  return api;
};
