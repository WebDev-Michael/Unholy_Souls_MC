import React from "react";
// import top9 from "../assets/images/top9.png";
import hero from "../assets/images/heroImage.png";

function Home() {
  return (
    <>
      <section className="flex flex-col pb-15">
        <h1 className="text-4xl font-bold text-center mb-5 border-b-4 border-amber-600 w-fit mx-auto">
          Welcome to Unholy Souls MC
        </h1>
        <img src={hero} alt="Top 9" className="rounded-lg mx-auto pb-10" />
        <h2 className="text-2xl font-bold text-center shadow-md mt-5 mb-5 border-b-4 border-amber-600 w-fit mx-auto">
          Who are we?
        </h2>
        <div className="pt-5 w-3/4 mx-auto bg-gray-600/50 rounded-lg p-5 border-l-4 border-r-4 border-amber-600">
          <p className="text-lg text-center">Founded on March 20th 2023</p>
          <p className="text-lg text-center mt-4">
            Unholy Souls MC came to fruition from a group of friends that share
            the same love for bikes and the MC lifestyle. Not knowing how to
            make a go at the life coming from living around other MC's.
          </p>
          <p className="text-lg text-center mt-4">
            Don Tito decided to start his own brand and build a club of family
            and brotherhood. Providing a life for his brothers and sisters.
            Protecting one another and standing up for the beliefs in the club
            making sure the Patch was always respected and honored.
          </p>
          <p className="text-lg text-center mt-4">
            Unholy Souls has become a brand that the members love and are proud
            of. Always looking to add membership and growing the family earning
            our spot in the MC culture based off Honesty, Loyalty and Respect.
          </p>
          <p className="text-lg text-center mt-6 font-bold italic text-amber-600">
            We Ride Together, We Die Together.
          </p>
        </div>
      </section>
      <h2 className="text-2xl font-bold text-center mb-5 border-b-4 border-amber-600 w-fit mx-auto">
        Where You Can Find Us
      </h2>
      <section className="flex flex-row items-center justify-center pb-10">
        <div className="pt-5 w-2/5 mx-auto bg-gray-600/50 rounded-lg p-5 border-b-4 border-l-4 border-amber-600">
          <h2 className="font-bold text-center text-amber-600 text-xl">
            BStar
          </h2>
          <p>Input information about BStar here</p>
        </div>
        <div className="pt-5 w-2/5 mx-auto bg-gray-600/50 rounded-lg p-5 border-b-4 border-r-4 border-amber-600">
          <h2 className="font-bold text-center text-amber-600 text-xl">
            OutKast
          </h2>
          <p>Input information about OutKast here</p>
        </div>
      </section>
      <section className="flex flex-col items-center justify-center pb-10">
        <h2 className="text-2xl font-bold text-center mt-5 mb-5 border-b-4 border-amber-600 w-fit mx-auto">
          How To Join
        </h2>
        <div className="pt-5 w-3/4 mx-auto bg-gray-600/60 rounded-lg p-5 border-l-4 border-r-4 border-amber-600">
          <p>
            If you think you have what it takes to be a part of a 1% MC in a
            fact-paced city, approach a member of the club and let them know you
            would like a meeting.
          </p>

          <p>
            DISCLOSURE: We are not a club that is looking for members. We are a
            club that is looking for family. If you are not willing to be a part
            of the family, we are not the club for you.
          </p>
        </div>
      </section>
    </>
  );
}

export default Home;
