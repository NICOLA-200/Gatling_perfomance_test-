import { atOnceUsers, pause, scenario, simulation, jmesPath } from "@gatling.io/core";
import { http, status } from "@gatling.io/http";

export default simulation((setUp) => {
    // Base HTTP configuration for Facebook Graph API
    const httpProtocol = http
        .baseUrl("https://graph.facebook.com") // Base URL for Facebook Graph API
        .acceptHeader("application/json")
        .contentTypeHeader("application/json");

    // Scenario: Fetch data from Facebook's Graph API
    const myScenario = scenario("Facebook API Test").exec(
        // Fetch public data for a specific page
        http("Fetch Page Data").get("/coca_cola?fields=name,fan_count,about")
            .header("Authorization", "Bearer YOUR_ACCESS_TOKEN") // Replace with your access token
            .check(status().is(200)) // Validate the request was successful
            .check(jmesPath("name").is("Coca-Cola")), // Validate the page name
        pause(2), // Pause to simulate real user behavior
        // Fetch posts for the specific page
        http("Fetch Page Posts").get("/coca_cola/posts")
            .header("Authorization", "Bearer YOUR_ACCESS_TOKEN")
            .check(status().is(200)) // Ensure successful response
            .check(jmesPath("data[0].id").exists()) // Ensure posts exist
    );

    // Simulation setup
    setUp(myScenario.injectOpen(atOnceUsers(5))).protocols(httpProtocol); // Simulate 5 users
});
