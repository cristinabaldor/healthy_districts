import pandas as pd
import numpy as np
import os
import csv
import requests
# import geopandas
from os.path import join, basename
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy import func
from flask import Flask, jsonify, render_template
import sqlite3
import json




app = Flask(__name__)

#################################################
# Database Setup
#################################################

from flask_sqlalchemy import SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///db.sqlite"

# Remove tracking modifications
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

engine = create_engine('sqlite:///db.sqlite')
Base = automap_base()
Base.prepare(engine, reflect=True)

districts_df_org=pd.read_csv('district_data.csv')

#The LCL and UCL columns represent the lower- and upper- confidence levels for the metrics. 
#Here those columns are removed.
districts_data_reduced = districts_df_org.drop(columns=['lackinsurance_LCL', 
                                                    'lackinsurance_UCL', 
                                                    'chekup_LCL', 
                                                    'checkup_UCL',
                                                    'cholscreen_LCL', 
                                                    'cholscreen_UCL', 
                                                    'diabetes_LCL',
                                                    'diabetes_UCL',
                                                    'flushot_LCL', 
                                                    'flushot_UCL', 
                                                    'ghlth_LCL', 'ghlth_UCL', 
                                                    'physical_inactivity_LCL', 
                                                    'physical_inactivity_UCL',
                                                     'physical_inactivity_LCL', 
                                                    'physical_inactivity_UCL',
                                                    'mcost_LCL', 
                                                    'mcost_UCL',
                                                    'mhlth_LCL', 
                                                    'mhlth_UCL',
                                                    'obesity_LCL', 
                                                    'obesity_UCL',
                                                    'csmoking_LCL', 
                                                    'csmoking_UCL',
                                                   ])

# Renaming C116 to GEOID column for matching with other data 
districts_df=districts_data_reduced.rename(columns={'CD116':"GEOID",
                                                   'State-District':'state_district'
                                                   })
districts_df['GEOID']=districts_df['GEOID'].astype(str).str.zfill(4)

#Converting percentages from strings to floats
districts_df['lackinsurance']=districts_df['lackinsurance'].str.strip('%').astype('float')/100.0
districts_df['checkup']=districts_df['checkup'].str.strip('%').astype('float')/100.0
districts_df['cholscreen']=districts_df['cholscreen'].str.strip('%').astype('float')/100.0
districts_df['csmoking']=districts_df['csmoking'].str.strip('%').astype('float')/100.0
districts_df['diabetes']=districts_df['diabetes'].str.strip('%').astype('float')/100.0
districts_df['flushot']=districts_df['flushot'].str.strip('%').astype('float')/100.0
districts_df['ghlth']=districts_df['ghlth'].str.strip('%').astype('float')/100.0
districts_df['physical_inactivity']=districts_df['physical_inactivity'].str.strip('%').astype('float')/100.0
districts_df['mcost']=districts_df['mcost'].str.strip('%').astype('float')/100.0
districts_df['mhlth']=districts_df['mhlth'].str.strip('%').astype('float')/100.0
districts_df['obesity']=districts_df['obesity'].str.strip('%').astype('float')/100.0

acsurl = "https://api.census.gov/data/2018/acs/acs1?get=NAME,B01001_001E,B02001_002E,B02001_003E,B02001_004E,B02001_005E,B02001_006E,B02001_007E,B02001_008E,B03003_003E,B29001_001E,B19013_001E,B19301_001E,B25077_001E,B25064_001E,B19083_001E,B25001_001E,B25002_002E,B25003_002E,B25003_003E,B25002_003E&for=congressional%20district:*"

#Requesting API data in JSON format, setting first row imported as headers for dataframe
acs_response = requests.get(f"{acsurl}").json()
acs_df=pd.DataFrame(acs_response)
acs_df.columns = acs_df.iloc[0]
acs_df= acs_df[1:]

#Converting codes to population types, guide here: http://proximityone.com/cd.htm

acs_df = acs_df.rename(columns={"B01001_001E": "totalpop",
                                      "B02001_002E": "white",
                                      "B02001_003E": "black",
                                      "B02001_004E": "amerindian_native",
                                      "B02001_005E": "asian",
                                      "B02001_006E": "hawaiian_pacific",
                                      "B02001_007E": "other_race",
                                      "B02001_008E": "two_more_races",
                                      "B03003_003E": "hispanic_latino",
                                        "B29001_001E": "citizen_voters",
                                      "B19013_001E": "median_household_income",
                                      "B19301_001E": "per_capita_income",
                                      "B25077_001E": "median_housing_value",
                                      "B25064_001E": "median_gross_rent",
                                      "B19083_001E": "gini_index_of_income_inequality",
                                      "B25001_001E": "total_housing_units",
                                      "B25002_002E": "occupied_units",
                                      "B25003_002E": "owner_occupied_units",
                                      "B25003_003E": "renter_occupied_units",
                                      "B25002_003E": "vacant_units",
                                      "state": "state",
                                      "congressional district": "district"})
#Adding a GEOID Column concatenating State and District Codes to get GEOID, which will be Primary Key in database
acs_df["GEOID"] = acs_df["state"] + acs_df["district"]

#Converting to percentages for demographic information
acs_df['totalpop']=acs_df['totalpop'].astype('float')
acs_df['median_household_income']=acs_df['median_household_income'].astype('float')
acs_df['white']=acs_df['white'].astype('float')
acs_df['black']=acs_df['black'].astype('float')
acs_df['asian']=acs_df['asian'].astype('float')
acs_df['amerindian_native']=acs_df['amerindian_native'].astype('float')
acs_df['hawaiian_pacific']=acs_df['hawaiian_pacific'].astype('float')
acs_df['other_race']=acs_df['other_race'].astype('float')
acs_df['two_more_races']=acs_df['two_more_races'].astype('float')
acs_df['hispanic_latino']=acs_df['hispanic_latino'].astype('float')
acs_df['citizen_voters']=acs_df['citizen_voters'].astype('float')


acs_df['white'] = acs_df['white']/acs_df['totalpop']
acs_df['black'] = acs_df['black']/acs_df['totalpop']
acs_df['amerindian_native'] = acs_df['amerindian_native']/acs_df['totalpop']
acs_df['asian'] = acs_df['asian']/acs_df['totalpop']
acs_df['hawaiian_pacific'] = acs_df['hawaiian_pacific']/acs_df['totalpop']
acs_df['other_race'] = acs_df['other_race']/acs_df['totalpop']
acs_df['two_more_races'] = acs_df['two_more_races']/acs_df['totalpop']
acs_df['hispanic_latino'] = acs_df['hispanic_latino']/acs_df['totalpop']
acs_df['citizen_voters'] = acs_df['citizen_voters']/acs_df['totalpop']


#Requesting current updated congressional data 
#from https://github.com/unitedstates/congress-legislators

congressurl = "https://theunitedstates.io/congress-legislators/legislators-current.csv"
congress_response = requests.get(f"{congressurl}",stream=True).content.decode('utf-8')
cr = csv.reader(congress_response.splitlines(), delimiter=',')
my_list = list(cr)
congress = pd.DataFrame(my_list[1:],columns=my_list[0])
congress['district']=congress['district'].astype(str).str.zfill(2)
#stripping extra spaces from State abbreviations
congress.state=congress.state.str.strip()

# Get indexes where type column is sen (Senators)
indexNames = congress[congress['type'] == 'sen'].index
 
# Delete these row indexes from dataFrame
congress.drop(indexNames , inplace=True)

#Getting State FIPS Codes with State Numbers to go with State Abbreviations in Congress file
fips=pd.read_csv('us-state-ansi-fips.csv')
fips=fips.rename(columns={"stname": "name",
                        " st": "number",
                        " stusps": "state"})
fips['number']=fips['number'].astype(str).str.zfill(2)
#Stripping extra spaces from state abbreviations that were preventing a merge
fips.state = fips.state.str.strip()


#Merging on 'state' to get state numbers into congress dataframe results in NaN
congress = congress.merge(fips, on = 'state', how='inner')
#Adding GEOID column
congress["GEOID"] = congress["number"] + congress["district"]


health_acs_merge= pd.merge(acs_df,districts_df, on='GEOID')
health_acs_congress_merge=pd.merge(health_acs_merge, congress, on="GEOID")

healthy_districts_df = health_acs_congress_merge[['GEOID',
                         'totalpop',
                         'party',
                         'full_name',
                         'gini_index_of_income_inequality' ,
                         'median_household_income',
                         'white',
                         'black',
                         'amerindian_native',
                         'asian',
                         'hawaiian_pacific', 
                         'other_race', 
                         'two_more_races', 
                         'hispanic_latino',
                         'citizen_voters',
                         'state_district', 
                         'lackinsurance',
                         'csmoking',
                         'diabetes',
                         'obesity',
                         'ghlth',
                         'mhlth',
                         'url',
                         'twitter' 
                        ]]


healthy_districts_df.set_index('GEOID')

healthy_districts_df=healthy_districts_df.sort_values(by=['state_district'])

# c116districts = geopandas.read_file('shapedata/tl_2019_us_cd116.shp')
# c116districts['GEOID']=c116districts['GEOID'].astype('str')
# c116districts.set_index('GEOID')
# healthy_districts_map = pd.merge(healthy_districts_df,c116districts, on='GEOID')
# healthy_districts_map=healthy_districts_map.set_index('state_district')
# healthy_districts_map=healthy_districts_map.sort_values(by=['state_district'])
#Exporting dataframe to SQLite
healthy_districts_df.to_sql('healthy_districts', con=engine,if_exists='replace')

table_data_df=healthy_districts_df[['state_district',
                             'full_name',
                             'party',
                             'median_household_income',
                             'amerindian_native',
                             'asian',
                             'black',
                             'white',
                             'hispanic_latino',
                             'lackinsurance',
                             'csmoking',
                             'diabetes',
                             'obesity']]

table_data_df= table_data_df.rename(columns = {'state_district': 'District',
                                     'full_name': 'Representative',
                                     'party': 'Political Party',
                                     'median_household_income': 'Median Income',
                                     'amerindian_native': 'American Indian/Alaskan Native',
                                     'asian': 'Asian',
                                    'black': 'Black',
                                     'white': 'White',
                                     'hispanic_latino': "Hispanic/Latino All Races",
                                     'lackinsurance': 'Uninsured',
                                     'csmoking': 'Currently Smoking',
                                     'diabetes': 'Adult Diabetics',
                                     'obesity': 'Obesity'},
                                   )


table_data_df.style.format({'Median Income':"${:,.0f}",
                             'American Indian/Alaskan Native':"{:.2%}",
                             'Asian':"{:.2%}",
                             'Black':"{:.2%}",
                             'White':"{:.2%}",
                             'Hispanic/Latino All Races':"{:.2%}",
                             'Uninsured':"{:.2%}",
                             'Currently Smoking':"{:.2%}",
                             'Adult Diabetics':"{:.2%}",
                             'Obesity':"{:.2%}"
                           })

table_data_df.set_index('District').sort_values(by=['District'])

#Exporting dataframe to SQLite
table_data_df.to_html('Templates/table.html', index=False, classes=['dataframe'],
formatters={
    'White': lambda x: '%10.2f' % x,
    'Black': lambda x: '%10.2f' % x,
'American Indian/Alaskan Native': lambda x: '%10.2f' % x,
'Asian': lambda x: '%10.2f' % x,
'Hispanic/Latino All Races': lambda x: '%10.2f' % x,
'Uninsured': lambda x: '%10.2f' % x,
'Currently Smoking': lambda x: '%10.2f' % x,
'Adult Diabetics': lambda x: '%10.2f' % x,
'Obesity': lambda x: '%10.2f' % x, 
    'Median Income': lambda x: '%10.0f' % x,
    }

)






@app.route('/json/')
def return_json():

    DB = "db.sqlite"

    def get_all_data(json_str=False):
        conn = sqlite3.connect(DB)
        # This enables column access by name: row['column_name']
        conn.row_factory = sqlite3.Row
        db = conn.cursor()
        rows = db.execute('''
        SELECT * from healthy_districts
        ''').fetchall()
        conn.commit()
        conn.close()
        if json_str:
            return json.dumps([dict(ix) for ix in rows])  # CREATE JSON
        return rows

    demo_json = get_all_data(json_str=True)
    return demo_json

@app.route('/table/')
def return_table():

    DB = "healthydistricts.db"

    def get_all_data_table(json_str=False):
        conn = sqlite3.connect(DB)
        # This enables column access by name: row['column_name']
        conn.row_factory = sqlite3.Row
        db = conn.cursor()
        rows = db.execute('''
        SELECT * from table_data
        ''').fetchall()
        conn.commit()
        conn.close()
        if json_str:
            return json.dumps([dict(ix) for ix in rows])  # CREATE JSON
        return rows

    demo_table = get_all_data_table(json_str=True)
    return demo_table


@app.route("/home")
def home():
    return render_template("index.html")

@app.route("/data")
def data():
    return render_template("data.html")

@app.route("/")
def landing():
    return render_template("index.html")


if __name__ == "__main__":
    app.run(debug=True)
