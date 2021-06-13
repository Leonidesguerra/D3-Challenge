### D3Times - d3 challenge

D3Times is a website which plots state demographic data in a scatter plot, displaing the relationship between health risks and income and age, which is rendered using the following tools. 

 - HTML
 - Bootstrap
 - JavaScript
 - CSS
 - D3.js



## Working process 

UFO- level 1
  
  For level 1, I used d3 to render a scatter plot for healthcare vs poverty. To do this I followed the this steps:
    1.- first step was to make the app responsive, using window size as a parameter. Where a responsive function is called each time the window is resized

    2.- I used d3 to add an svg area into the html, where the plot should be rendered. I used window size as reference for svg size and margins, in order for the plot to be responsive acording to window size.
    
    3.-I used d3 to read the csv file containing the data

    4.- Using the data from step 3 I generated x and y scales and axes and added them into the svg area.

    5.- I generated cirles as the plot points and styling them with css in a d3Style.css document then. To do this I parsed the data into inegers and used this values as x, y coordinates to position the circles on the plot. 

    6.- I added the state abbreviations to each circle using the same coordinates from step 5

    7.- I added a d3-tooltip to display the state name and values, when hovering the mouse over each point.



 Bonus

  For the bonus part I added smokig and obesity demographic data to the y axis and age and household income to the x axis. By adding this variants you are able to select any of the y demographics and plot them vs any x values. I used transitions to display the changes when the selection changes.