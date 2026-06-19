import { useState } from 'react';
import { Banner, About, Objectives, How_works, Footer} from './Components'
import './App.css'

function App() {

  return (
    <>
      <Banner/>
      <About/>
      
      <How_works/>
      <Objectives/>
      <Footer/>
    </>
  )
}

export { App }
