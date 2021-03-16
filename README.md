# healthy_districts

Python app that collects publicly available demographic and healthcare data by congressional district, then visualizes that data using Chart.js and Leaflet/Mapbox.

Project2.ipynb//jupyter notebook uses Requests to download latest congressional data and selected data from the American Community Survey, and reads in a csv and shapefile of congressional districts, creates dataframes and exports tables to SQLite

healthydistricts.db// app.py data is written to tables in this SQL database

app.py// reads in database and creates a json route using Flask, renders index and map pages.

.js files read the data in the JSON route to create visualizations that change based on selected axes, map the congressional districts and create Tooltips that provide detail by district on the map.

![image](https://user-images.githubusercontent.com/68877416/111365133-7e61ee00-8668-11eb-9d9d-235ee29ec2f1.png)

![image](https://user-images.githubusercontent.com/68877416/111365160-86ba2900-8668-11eb-8440-eea0ee03598b.png)

Tooltips
![image](https://user-images.githubusercontent.com/68877416/111365187-8f126400-8668-11eb-97ac-12228b4c89e3.png)

![image](https://user-images.githubusercontent.com/68877416/111365221-98033580-8668-11eb-8d71-d47b263883fa.png)

Map with Tooltips
![image](https://user-images.githubusercontent.com/68877416/111365285-b23d1380-8668-11eb-8a85-163606907068.png)
