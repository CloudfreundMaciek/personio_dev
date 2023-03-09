define([], function() {
  return {
    "PropertyPaneDescription": "Ermögliche deinen Mitarbeitern ihre Projekte, An- und Abwesenheiten verwalten an einem einzigen Ort",
    "Title": "Personio Adaptive Card",
    "CardViewLoading": "Laden...",
    "CardViewMain": "Tippe, um deine Arbeit zu verwalten",
    "QuickViewButton": "Personio",
    "QuickView": {
      "Response": {
        "Successful": {
          "ProjectCreated": "Das Projekt wurde erfolgreich geschaffen!",
          "ProjectFinished": "Das Projekt wurde erfolgreich fertiggestellt!",
          "AttendanceSaved": "Die Anwesenheit wurde erfolgreich gespeichert!",
          "AbsenceRequested": "Deine Anfrage wurde erfolgreich zugeliefert!",
          "AbsenceApproved": "Dein Antrag wurde genehmight!"
        }
      },
      "Menu": {
        "Buttons": {
          "Attendance": "Anwesenheit",
          "Absence": "Abwesenheit",
          "Projects": "Projekte"
        }
      },
      "Attendance": {
        "Menu": {
          "Header": "Anwesenheit",
          "Buttons": {
            "Form": "Formular",
            "Overview": "Überblick",
            "Back": "Zurück"
          }
        },
        "Form": {
          "Header": "Anwesenheit Formular",
          "Required": "Verlangt",
          "Fields": {
            "Date": "Datum",
            "Start": "Start",
            "End": "Ende",
            "BreakLength": "Pausedauer",
            "Project": "Projekt",
            "Comment": "Kommentar"
          },
          "Buttons": {
            "Submit": "Beantrage",
            "Back": "Zurück"
          }
        },
        "Overview": {
          "Header": "Anwesenheitsüberblick",
          "TimePeriod": [
            "Seit",
            "bis jetzt"
          ],
          "Attendance": {
            "Since": "Seit",
            "To": "Bis",
            "Break": [
              "Pasue:",
              "Minuten"
            ],
            "Project": "Projekt",
            "Comment": "Kommentar",
          },
          "Buttons": {
            "Delete": {
              "Title": "Lösche eine Anwesenheit",
              "Card": {
                "Choice": "Wähle die IDNr.",
                "Button": "Bestätige"
              }
            },
            "Back": "Zurück"
          },
          "Empty": {
            "Message": "Du hast keine Anwesenheiten in diesem Zeitraum...",
            "Submit": "Beantrage eine neue Anwesenheit"
          }
        }
      },
      "Absence": {
        "Menu": {
          "Header": "Abwesenheit",
          "Buttons": {
            "Form": "Formular",
            "Overview": "Überblick",
            "Back": "Zurück"
          }
        },
        "Form": {
          "Header": "Abwesenheit Formular",
          "LeftDays": [
            "Du hast noch",
            "Urlaubstage übrig"
          ],
          "Required": "Verlangt",
          "Fields": {
            "AbsenceType": "Abwesenheitsgrund",
            "Start": "Start",
            "End": "Ende",
            "HalfStart": "Halbtag Start",
            "HalfEnd": "Halbtag Ende",
            "Comment": "Kommentar"
          },
          "Buttons": {
            "Submit": "Beantrage eine Abwesenheit",
            "Back": "Zurück"
          }
        },
        "Overview": {
          "Header": "Abwesenheitsüberblick",
          "LeftDays": [
            "Du hast noch",
            "Urlaubstage übrig"
          ],
          "Absence": {
            "Start": "Start",
            "End": "Ende",
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
          "Field": "Title",
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