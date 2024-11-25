import { atOnceUsers, csv, pause, scenario, simulation ,jmesPath , feed  } from "@gatling.io/core";
import { http, status } from "@gatling.io/http";


export default simulation((setUp) => {
   
    
    const  httpProtocol = http
     .baseUrl("https://www.videogamedb.uk/api/v2")
     .acceptHeader("application/json")
     .contentTypeHeader("application/json");
     
     //scenario
     const myScenario  =  scenario("My Scenario")
     .exec(http("Get all games").get("/videogame")
     .check(status().is(200)),
     pause(5)
    )


    //Feeder for test data
    const feeder  =  csv("videogames.csv").random()

//     const myScenario  =  scenario("My Scenario")
//     .exec(http("Get all games").get("/videogame")
//     .check(status().is(200))
//     .check(jmesPath("[0].id").saveAs("firstGameId")),
//     pause(5),
//     http("Get single game").get("/videogame/#{firstGameId}")
//     .check(status().is(200))
//     .check(jmesPath("name").is("Resident Evil 4"))
//    )

//     const myScenario0 = scenario("User Browsing Scenario")
//   .exec(
//     http("Home Page Request").get("/") // User visits the home page
//   )
//   .exec(
//     http("Product Page Request").get("/product/123") // User views a product page
//   )
//   .exec(
//     http("Add to Cart Request").post("/cart").body("productId=123") // User adds the product to the cart
//   );

const myScenario1 = scenario("My Scenario").exec(
    http("Get All Games").get("/videogame")
        .check(status().is(200))
        .check(jmesPath("[0].id").saveAs("firstGameId")),
    pause(5),
    http("Get Single Game").get("/videogame/#{firstGameId}")
        .check(status().is(200))
        .check(jmesPath("name").is("Resident Evil 4")),
    pause(2),
    feed(feeder),
    http("Get Game: #{gameName}").get("/videogame/#{gameId}")
        .check(jmesPath("name").isEL("#{gameName}"))
    )

    // simulation
    setUp(myScenario1.injectOpen(atOnceUsers(5))).protocols(httpProtocol); 
});


// setUp(myScenario.injectOpen(
//     atOnceUsers(5),
//     rampUsers(10).during(10)
//     ).protocols(httpProtocol));

// });