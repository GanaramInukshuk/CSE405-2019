This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# EXPERIMENTAL CITY BUILDER INCREMENTAL GAME

Name:  Giovanni Oriuela<br>
Alias: Ganaram Inukshuk; gdInuk<br>
Class: CSE-405 Spring 2019<br>
Prof.: Dr. David Turner

This readme will be used as the program's software requirements specification (SRS).<br>
This document is tentative and is subject to change.

Expect some formatting mistakes as I get the readme properly set up.<br>

UPDATED: 30 APR 19

## DEFINITIONS

###Gameplay Terms:
 - Incremental game - A genre of games where the goal is to increment a number as high and as fast as you can. A noteworthy example is Cookie Clicker.
 - City builder/simulator - A genre of games where the goal is to build a city. Noteworthy examples include SimCity 4 and Cities: Skylines.
 
### Programming Terms:
 - JavaScript - The main programming language used for the game.
 - React - A JavaScript library used to create the user interface for the game.
 - JavaScript Object Notation (JSON) - The notation used to represent savefiles for the game.
 
### Implementation Terms:
 - Manager - A class used to handle some aspect of gameplay. Managers take in a value and use statistics to generate semi-realistic data for other managers to use.
 - Vector - In C++, a vector is a type of data structure that is basically a resizable array. In this project, "array" and "vector" are used interchangeably.
 
### Statistical Terms:
 - Probability distribution - A mathematical function that provides the probabilities of occurrences of different possible outcomes of an experiment (Source: Wikipedia). Here, probabilities are not calculated using a function but using an array of preset probabilities (weights vector).
 - Weights vector - An array of probabilities used by a manager. The sum of these weights must add up to 1.
 
### Miscellaneous:
 - Arrow notation - One of many ways to write JavaScript functions. React uses arrow notation ( => ) for implementing functions in JavaScript.

## "Gameplay"

The game is currently set up like a Cookie Clicker clone. Residents pay taxes and the tax money is used to build additional buildings.

The user can save the game to a server or export the savefile in JSON format.

##

The city builder consists of classes, called "managers", that handle some aspect of the simulation.

### General functionality of a manager:
 - Each manager has a hardcoded array of values (referred internally as vectors) that handle distributions. There is additional code designed to handle tiny fluctuations to these distributions, to make things interesting.
 - There are setters and getters for each manager. The getters are mainly used for passing values between managers, whereas the setters are used for loading from a savefile. (The getters are also used for retrieving data to be saved.)
 - Certain managers have a generate function (they have "generate" in the name) used to generate a semi-realistic distribution; for example, housing distribution for the housing manager.

Due to the inherent complexity of a city simulator, a minimum of two managers will be implemented. Other managers may be added as time permits.
The descriptions of these managers (and other proposed managers) are described below.

### HousingManager 
STATUS: Not implemented; combined with OccupancyManager
 - Manages residential buildings
 - Each building has space for 1, 2, 4, 8,... households within
 - Housing structures that are built are handled by the HousingManager
 - The total number of (usable) households is tallied up and passed to the OccupancyManager

### OccupancyManager
STATUS: Implemented under the name of HousingManager; currently includes functionality of the HousingManager
 - Calculates the number of people living per households using data from the HousingManager
 - Households are broken up into 8 groups, each group representing 1, 2, 3, 4, 5, 6, 7, or 8 people living per household
 - Real life occupancy data shows the number of people per household is roughly a Poisson distribution, meaning that houses with 2-3 people are common, 1, 4, and 5 not as common, and 6, 7, and 8 increasingly rare
 - The aforementioned Poisson distribution averages out to 3 people per household; the current US average is 2.5, but 3 was chosen for the sake of the game (and this was also the average in the 1970s so it's not out of place)

### PopulationManager
STATUS: Implemented
 - Calculates the number of people that fall into which age group using data from the OccupancyManager
 - There are 10 age groups; age groups go from 0-9, 10-19, 20-29, all the way to 90+
 - The data for the United States's population pyramid is used to calculate the number of people within each age group
 - The population is also broken up into 5 general groups: children (0-9), teens (11-19), young adults (20-39), adults (40-69), and seniors (70+)
 - Meaningful data can only be generated once the population reaches 300

### WorkforceManager
STATUS: Proposed
 - Calculates the number of eligible workers using data from the PopulationManager
 - The eligible workforce will consist of some percentage of teens, young adults, adults, and a small percent of seniors (EG, retired persons who insist on working anyway)
 
## SAVEFILES
 
To be determined