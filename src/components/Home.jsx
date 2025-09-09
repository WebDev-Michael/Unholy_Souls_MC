import React from "react";

function Home() {
  return (
    <div className="pt-30 sm:pt-32 px-4 sm:px-6 lg:px-8 min-h-screen">
      <section className="flex flex-col pb-8 sm:pb-15">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 sm:mb-5 border-b-4 border-amber-600 w-fit mx-auto px-4">
          Welcome to Unholy Souls MC
        </h1>
        <div className="relative w-full aspect-video max-w-4xl mx-auto">
          <iframe 
            src="https://www.youtube.com/embed/WSOalfxZV4I"
            title="YouTube video player"
            className="absolute top-0 left-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-center shadow-md mt-4 sm:mt-5 mb-4 sm:mb-5 border-b-4 border-amber-600 w-fit mx-auto px-4">
          Who are we?
        </h2>
        <div className="pt-4 sm:pt-5 w-full sm:w-4/5 lg:w-3/4 mx-auto bg-gray-600/50 rounded-lg p-4 sm:p-5 border-l-4 border-r-4 border-amber-600">
          <p className="text-base sm:text-lg text-center">Founded on March 20th 2023</p>
          <p className="text-base sm:text-lg text-center mt-3 sm:mt-4">
            Unholy Souls MC came to fruition from a group of friends that share
            the same love for bikes and the MC lifestyle. Not knowing how to
            make a go at the life coming from living around other MC's.
          </p>
          <p className="text-base sm:text-lg text-center mt-3 sm:mt-4">
            Don Tito decided to start his own brand and build a club of family
            and brotherhood. Providing a life for his brothers and sisters.
            Protecting one another and standing up for the beliefs in the club
            making sure the Patch was always respected and honored.
          </p>
          <p className="text-base sm:text-lg text-center mt-3 sm:mt-4">
            Unholy Souls has become a brand that the members love and are proud
            of. Always looking to add membership and growing the family earning
            our spot in the MC culture based off Honesty, Loyalty and Respect.
          </p>
          <p className="text-base sm:text-lg text-center mt-4 sm:mt-6 font-bold italic text-amber-600">
            We Ride Together, We Die Together.
          </p>
        </div>
      </section>
      
      <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-5 border-b-4 border-amber-600 w-fit mx-auto px-4">
        Where You Can Find Us
      </h2>
      <section className="flex flex-col sm:flex-row items-center justify-center pb-8 sm:pb-10 gap-4 sm:gap-6">
        <div className="pt-4 sm:pt-5 w-full sm:w-2/5 mx-auto bg-gray-600/50 rounded-lg p-4 sm:p-5 border-b-4 border-l-4 border-amber-600">
          <img 
            src="https://imgur.com/bbeSsja.png" 
            alt="BStar Logo" 
            className="rounded-lg max-w-[200px] max-h-[200px] mx-auto"
          />
          <p className="text-sm sm:text-base">Located in the South of Los Santos, the <span className="font-bold text-amber-600">Unholy Souls Dockside Chapter</span> bring about a new era of excitement to the city. A 1% MC like no other the city has seen before. We are known for our brotherhood and loyalty to one another. We are known for our respect for the patch and the club. And we are known for ending a fight, but never starting it. We keep to ourselves and keep to our business.</p>
        </div>
        <div className="pt-4 sm:pt-5 w-full sm:w-2/5 mx-auto bg-gray-600/50 rounded-lg p-4 sm:p-5 border-b-4 border-r-4 border-amber-600">
        <img 
            src="https://imgur.com/vZYbKq2.png" 
            alt="Outkast Logo" 
            className="rounded-4xl max-w-[200px] max-h-[200px] mx-auto"
          />
          <p className="text-sm sm:text-base"><span className="font-bold text-amber-600">Bay City</span>. The original chapter started March 20th 2023 by our founding members, The glory and history behind it is tales of legend. These days its a flourishing Chapter in Grapeseed outside of the hustle and bustle of the city proper. Known for its brotherhood and prestige as well as a respectable hub for the diamond win or lose! Nobody knows our business and it stays that way.</p>
        </div>
      </section>
      
      <section className="flex flex-col items-center justify-center pb-8 sm:pb-10">
        <h2 className="text-xl sm:text-2xl font-bold text-center mt-4 sm:mt-5 mb-4 sm:mb-5 border-b-4 border-amber-600 w-fit mx-auto px-4">
          How To Join
        </h2>
        <div className="pt-4 sm:pt-5 w-full sm:w-4/5 lg:w-3/4 mx-auto bg-gray-600/60 rounded-lg p-4 sm:p-5 border-l-4 border-r-4 border-amber-600">
          <p className="text-sm sm:text-base mb-3">
            If you think you have what it takes to be a part of a 1% MC in a
            fast-paced city, approach a member of the club and let them know you
            would like a meeting.
          </p>

          <p className="text-sm sm:text-base">
            DISCLOSURE: We are not a club that is looking for members. We are a
            club that is looking for family. If you are not willing to be a part
            of the family, we are not the club for you.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Home;
