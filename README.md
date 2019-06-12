## Colaborators:
Ryan Whitehill
https://github.com/ShererStress/

## Inclined Plane

## Technologies Used:
Javascript, HTML, CSS, Ruby, Rails, React, NPM
Leaflet
API datasource: Opensky-network: https://opensky-network.org/

## Link to Working pProject
https://mighty-stream-87461.herokuapp.com/

## Back-end Counter Part
https://github.com/ShererStress/project_four_rails

Why we chose this project:
Ryan and I were both tired of working on projects that were based around a check-out cart or dynamically updating a check-list. During our brainstorming session we decided that we wanted to solve a puzzle. We discussed potential projects such as real time stock updates displayed in a user-friendly way and others. We started this project wanting to be able to track live flight data with interactive display. Having worked on maps in a previous project, I was excited to integrate that past knowledge into react. We started with a basic outline and set up a task tracker.

Front-end Process:
As Ryan worked on setting up the back-end, I worked on setting up the structure of our app and implementing an interactive map through leaflet.js imported through react-leaflet.js. Having struggling through the doccumentation in an earlier project, importing the map with react felt significantly easier. After installing through npm, the process for setting up a basic map is straightforward. Gathering the live flight data was accomplished through an api call to opensky-network(https://opensky-network.org/api/). 

I configured the data to generate markers that were placed with the live data longitude and latitude. Now that the back-end allowed for users to save plane data, I was able to set state to reflect different groupings of planes. In conjunction with the map, users would be able to track planes and see what planes were being tracked by other users. Users are also able to stop tracking flights as well as being prompted on when planes have fallen out of the api call (usually on landing or going out of our geographically defined api call).

Once we had our app functioning properly (wishlist for future improvements still to come) I styled the app using CSS grid. I found that using grid was a much more efficient and predictable way to style compared with flexbox or float. 


Back-end process + frontend data management (Ryan):
The back-end setup for this project was fairly straightforward - nothing novel here! We needed to store username/password data for visitors, so I put together a set of routes to allow for full CRUD operations for this model. Users can add, edit, delete, and (partially) view their user data, as well as log in and log out with the functionality in the rails app.

Next, we needed to keep track of which planes the users were watching (tracking). This meant a second table for these planes - it includes the database ID of the user tracking it as well as the plane's unique ICAO ID. During certain queries, the backend returns a joined version of the two tables. 

The tricker part of making use of the back-end was managing the dataflow on the front-end: the users/planes data from the backend only had the planes' IDs, and it had to be combined with data from the 3rd party 'opensky network' API before we could put the planes on the map. In order to do this properly, I set up an asynchronous function to wait until both API calls were complete and then process the data. In short, each plane from Opensky is placed into an array based on who is tracking it, and any user tracked planes not in the Opensky dataset are presented as such to the user.


User Stories:
-MVP Requirements
A visitor to the site can:
-Create a new user account
-log in with an existing user account
-Edit and delete that user account

-Stretch
A visitor to the site can also:
View a map that:
  -Displays the location of aircraft from opensky-network
  -These aircraft pins update on each new API call
Interact with the aircraft pins:
  -Select them to view additional data
  -Add them to a tracker to keep track of it passively
See what aircraft pins other users are tracking


Wishlist:
Toggle on the map to show all api results vs just user tracked planes.
Graphs of historical data for analysis.
Animations that predict marker movement between rerender.
Connecting users via socket.io (or something similar) to reduce the number of Opensky API calls


