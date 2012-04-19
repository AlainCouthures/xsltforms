There are two examples:

Vis: Inserting with the "to-be-added" record visible before the "Add Record" event is triggered.
This requires additional "NewRecord" instance variables to be bound to the input controls but allows the user to see what data elements are required before the add.

Non_Vis: Inserting with the "to-be-added" record after the "Add Record" event is triggered.
This does not require seperate "New Record" instance variables to be bound but does not allow the user to see what new data elements are required.  It also implies that the save will save the data.