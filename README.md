## Colaborators:
Ryan Whitehill
https://github.com/ShererStress/

## Inclined Plane
Technology:
React.js | 
Ruby on Rails

Why we chose this project:
Ryan and I were both tired of working on projects that were based around a check-out cart or dynamically updating a check-list. During our brainstorming session we decided that we wanted to solve a puzzle. We discussed potential projects such as real time stock updates displayed in a user-friendly way and others. We started this project wanting to be able to track live flight data with interactive display. Having worked on maps in a previous project, I was excited to integrate that past knowledge into react. We started with a basic outline and set up a task tracker.

Front-end Process:
As Ryan worked on setting up the back-end, I worked on setting up the structure of our app and implementing an interactive map through leaflet.js imported through react-leaflet.js. Having struggling through the doccumentation in an earlier project, importing the map with react felt significantly easier. After installing through npm, the process for setting up a basic map is straightforward. Gathering the live flight data was accomplished through an api call to opensky-network(https://opensky-network.org/api/). 

I configured the data to generate markers that were placed with the live data longitude and latitude. Now that the back-end allowed for users to save plane data, I was able to set state to reflect different groupings of planes. In conjunction with the map, users would be able to track planes and see what planes were being tracked by other users. Users are also able to stop tracking flights as well as being prompted on when planes have fallen out of the api call (usually on landing or going out of our geographically defined api call).

Once we had our app functioning properly (wishlist for future improvements still to come) I styled the app using CSS grid. I found that using grid was a much more efficient and predictable way to style compared with flexbox or float. 

Wishlist:
Toggle on the map to show all api results vs just user tracked planes.
Graphs of historical data for analysis.
Animations that predict marker movement between rerender.

## Link to working project
https://mighty-stream-87461.herokuapp.com/

## Back-end Counter Part
https://github.com/ShererStress/project_four_rails
