define([], function() {
  return {
    "PropertyPaneDescription": "Enable the employees ask for a time-off, create new projects or register their work time.",
    "Title": "Personio Adaptive Card",
    "CardViewMain": "Click to manage your work",
    "CardViewLoading": "Loading...",
    "CardViewError": "An error has ocurred...",
    "QuickViewButton": "Personio",
    "QuickView": {
      "Response": {
        "Successful": {
          "ProjectCreated": "The project has been successfuly created!",
          "ProjectFinished": "The project has been successfuly finished!",
          "AttendanceSaved": "The attendance has been successfully saved!",
          "AbsenceRequested": "Your request has been successfuly delivered.",
          "AbsenceApproved": "Your request has been approved!"
        }
      },
      "Menu": {
        "Buttons": {
          "Attendance": "Attendance",
          "Absence": "Absence",
          "Projects": "Projects"
        }
      },
      "Attendance": {
        "Menu": {
          "Header": "Attendance",
          "Buttons": {
            "Form": "Form",
            "Overview": "Overview",
            "Back": "Back"
          }
        },
        "Form": {
          "Header": "Attendance form",
          "Required": "Required",
          "Fields": {
            "Date": "Date",
            "Start": "Start",
            "End": "End",
            "BreakLength": "Break length",
            "Project": "Project",
            "Comment": "Comment"
          },
          "Buttons": {
            "Submit": "Submit",
            "Back": "Back"
          },
          "Error": "The end time has to take place after the start time. Please try again :)"
        },
        "Overview": {
          "Header": "Attendance overview",
          "TimePeriod": [
            "Since",
            "till now"
          ],
          "Attendance": {
            "Since": "Since",
            "To": "To",
            "Break": [
              "Break:",
              "minutes"
            ],
            "Project": "Project",
            "Comment": "Comment",
          },
          "Buttons": {
            "Delete": {
              "Title": "Delete Attendance",
              "Card": {
                "Choice": "Choose the ID",
                "Button": "Confirm"
              }
            },
            "Back": "Back"
          },
          "Empty": {
            "Message": "You haven't registered any attendances during that period...",
            "Submit": "Submit new attendance"
          }
        }
      },
      "Absence": {
        "Menu": {
          "Header": "Absence",
          "Buttons": {
            "Form": "Form",
            "Overview": "Overview",
            "Back": "Back"
          }
        },
        "Form": {
          "Header": "Absence form",
          "LeftDays": [
            "You've got",
            "of your holidays days left"
          ],
          "Required": "Required",
          "Fields": {
            "AbsenceType": "Absence's purpose",
            "Start": "Start",
            "End": "End",
            "HalfStart": "Half-day start",
            "HalfEnd": "Half-day end",
            "Comment": "Comment"
          },
          "Buttons": {
            "Submit": "Submit time-off",
            "Back": "Back"
          },
          "Error": "The end date has to take place after the start date. Please try again :)"
        },
        "Overview": {
          "Header": "Absence overview",
          "LeftDays": [
            "You've got",
            "of your holidays days left"
          ],
          "Absence": {
            "Start": "Start",
            "End": "End",
            "Status": "Status:",
          },
          "Empty": {
            "Message": "You haven't planned any times off yet...",
            "Submit": "Submit new absence",
          },
          "Buttons": {
            "Cancel": {
              "Title": "Cancel time-off",
              "Card": {
                "Choice": "Choose the ID",
                "Confirm": "Confirm"
              }
            },
            "Back": "Back"
          }
        }
      },
      "Projects": {
        "Menu": {
          "Header": "Projects",
          "Buttons": {
            "Form": "Form",
            "Overview": "Overview",
            "Back": "Back",
          }
        },
        "Form": {
          "Header": "Project form",
          "Field": "Name",
          "Buttons": {
            "Create": "Create a project",
            "Back": "Back",
          }
        },
        "Overview": {
          "Header": "Projects overview",
          "Buttons": {
            "Finish": {
              "Title": "Finish a project",
              "Card": {
                "Choice": "Choose the project",
                "Confirm": "Confirm"
              }
            },
            "Back": "Back",
          },
          "Empty": {
            "Message": "There is no project to work on...",
            "Create": "Create a project"
          }
        }
      }
    }
  }
});