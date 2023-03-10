declare interface IPersonioAttendanceFormAdaptiveCardExtensionStrings {
  PropertyPaneDescription: string;
  CardViewMain: string;
  CardViewLoading: string;
  CardViewError: string;
  PropertyPane: {
    ButtonLabel: string;
    Content: string;
    Fields: {
      Attendance: string;
      Absence: string;
      Projects: string;
    }
  }
  QuickViewButton: string;
  QuickView: {
    Loading: string;
    Response: {
      Successful: {
        ProjectCreated: string;
        ProjectFinished: string;
        AttendanceSaved: string;
        AttendanceDeleted: string;
        AbsenceRequested: string;
        AbsenceApproved: string;
        AbsenceDeleted: string;
      },
      Back: string;
    },
    Menu: {
      Buttons: {
        Attendance: string;
        Absence: string;
        Project: string;
      }
    },
    Attendance: {
      Menu: {
        Header: string;
        Buttons: {
          Form: string;
          Overview: string;
          Back: string;
        }
      },
      Form: {
        Header: string;
        Required: string;
        Fields: {
          Date: string;
          Start: string;
          End: string;
          BreakLength: string;
          Project: string;
          Comment: string;
        },
        Buttons: {
          Submit: string;
          Back: string;
        },
        Error: string;
      },
      Overview: {
        Header: string;
        TimePeriod: [string, string];
        Attendance: {
          Since: string;
          To: string;
          Break: [string, string];
          Project: string;
          Comment: string;
        },
        Buttons: {
          Delete: {
            Title: string;
            Card: {
              Choice: string;
              Button: string;
            }
          };
          Back: string;
        }
        Empty: {
          Message: string;
          Submit: string;
        };
      }
    },
    Absence: {
      Menu: {
        Header: string;
        Buttons: {
          Form: string;
          Overview: string;
          Back: string;
        }
      },
      Form: {
        Header: string;
        LeftDays: [string, string];
        Required: string;
        Fields: {
          AbsenceType: string;
          Start: string;
          End: string;
          HalfStart: string;
          HalfEnd: string;
          Comment: string;
        },
        Buttons: {
          Submit: string;
          Back: string;
        },
        Error: string;
      },
      Overview: {
        Header: string;
        LeftDays: [string, string];
        Absence: {
          Start: string;
          End: string;
          Status: {
            Status: string;
            Requested: string;
            Approved: string;
          };
        },
        Empty: {
          Message: string;
          Submit: string;
        },
        Buttons: {
          Cancel: {
            Title: string;
            Card: {
              Choice: string;
              Confirm: string;
            }
          };
          Back: string;
        }
      }
    },
    Projects: {
      Menu: {
        Header: string;
        Buttons: {
          Form: string;
          Overview: string;
          Back: string;
        }
      },
      Form: {
        Header: string;
        Field: string;
        Buttons: {
          Create: string;
          Back: string;
        }
      },
      Overview: {
        Header: string;
        Buttons: {
          Finish: {
            Title: string;
            Card: {
              Choice: string;
              Confirm: string;
            }
          };
          Back: string;
        },
        Empty: {
          Message: string;
          Create: string;
        }
      }
    }
  }
}

declare module 'PersonioAttendanceFormAdaptiveCardExtensionStrings' {
  const strings: IPersonioAttendanceFormAdaptiveCardExtensionStrings;
  export = strings;
}
