define([], function() {
  return {
    "PropertyPaneDescription": "Ermögliche deinen Mitarbeitern ihre Projekte, An- und Abwesenheiten verwalten an einem einzigen Ort",
    "Title": "Personio Adaptive Card",
    "CardViewMain": "Tippe, um deine Arbeit zu verwalten",
    "CardViewLoading": "Laden...",
    "CardViewError": "Ein Fehler ist aufgetreten...",
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
          "Header": "Anwesenheitsformular",
          "Required": "Verlangt",
          "Fields": {
            "Date": "Datum",
            "Start": "Beginn",
            "End": "Ende",
            "BreakLength": "Pausedauer",
            "Project": "Projekt",
            "Comment": "Kommentar"
          },
          "Buttons": {
            "Submit": "Beantrage",
            "Back": "Zurück"
          },
          "Error": "Die Endezeit muss nach der Beginnzeit stattfinden. Versuche es nochmal :)"
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
            "Message": "Du hast noch keine Anwesenheiten in diesem Zeitraum...",
            "Submit": "Beantrage eine Anwesenheit"
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
          "Header": "Abwesenheitsformular",
          "LeftDays": [
            "Du hast noch",
            "Urlaubstage übrig"
          ],
          "Required": "Verlangt",
          "Fields": {
            "AbsenceType": "Abwesenheitsgrund",
            "Start": "Beginn",
            "End": "Ende",
            "HalfStart": "Halbtag Beginn",
            "HalfEnd": "Halbtag Ende",
            "Comment": "Kommentar"
          },
          "Buttons": {
            "Submit": "Beantrage eine Abwesenheit",
            "Back": "Zurück"
          },
          "Error": "Das Endedatum muss nach dem Beginndatum stattfinden. Versuche es nochmal :)"
        },
        "Overview": {
          "Header": "Abwesenheitsüberblick",
          "LeftDays": [
            "Du hast noch",
            "Urlaubstage übrig"
          ],
          "Absence": {
            "Start": "Beginn",
            "End": "Ende",
            "Status": "Status:",
          },
          "Empty": {
            "Message": "Du hast noch keine Abwesenheiten geplant...",
            "Submit": "Beantrage eine Abwesenheit",
          },
          "Buttons": {
            "Cancel": {
              "Title": "Lösche eine Abwesenheit",
              "Card": {
                "Choice": "Wähle die IDNr.",
                "Confirm": "Bestätige"
              }
            },
            "Back": "Zurück"
          }
        }
      },
      "Projects": {
        "Menu": {
          "Header": "Projekte",
          "Buttons": {
            "Form": "Formular",
            "Overview": "Überblick",
            "Back": "Zurück",
          }
        },
        "Form": {
          "Header": "Projektsformular",
          "Field": "Name",
          "Buttons": {
            "Create": "Schaffe einen Projekt",
            "Back": "Zurück",
          }
        },
        "Overview": {
          "Header": "Projektenüberblick",
          "Buttons": {
            "Finish": {
              "Title": "Beende einen Projekt",
              "Card": {
                "Choice": "Wähle einen Projekt",
                "Confirm": "Bestätige"
              }
            },
            "Back": "Zurück",
          },
          "Empty": {
            "Message": "Es gibt keine Projekte zu bearbeiten...",
            "Create": "Schaffe einen Projekt"
          }
        }
      }
    }
  }
});