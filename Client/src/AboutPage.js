import React from 'react'

import "./styling_folder/generalSiteStyling.css";
import "./styling_folder/aboutPage.css";

export default function AboutPage() {
  return (
    <div>
        <div className='pageName' style={{borderBottom: "double"}}>
            <h1>
              About
            </h1>
        </div>

        <div className='aboutUsCnt'>
            <h1>
                Who We Are?
            </h1>
            <p>
              Welcome to our website dedicated to cars, 3D printing, and technology!
              <br></br>
              We are a community-driven platform founded by a team of car enthusiasts who share a passion for all things automotive and 3D printing.
              <br></br><br></br>
              With years of experience in the automotive industry, we created this website for fellow car enthusiasts who are equally passionate about cars, 3D printing, and technology.
              <br></br>
              Our goal is to provide a space where we can come together to and share files, tips and tricks on 3D printing in the automotive world, and showcase our love for cars.
            </p>
            <img className='aboutImg' src={require('./styling_folder/images/peugeot206Cup.JPG')} alt="Race car"/>
            <br></br>
            <p className='bottomParagraph'>
            As a team, we are committed to creating a platform based on sharing and pure giving.
              <br></br>
              We believe that by sharing our knowledge and expertise with the community, we can help inspire and educate the next generation of car enthusiasts.
              <br></br><br></br>
              Whether you're a seasoned car enthusiast or just getting started in the world of cars, 3D printing, and technology, we welcome you to our community.
              <br></br>
              Join us in celebrating our love for cars, technology, and the endless possibilities that lie ahead.
            </p>
        </div>
    </div>
  )
}
