# select-dropdown-handsontable-extension
A select dropdown that accepts value-text pair.

This works best with Handsontable 0.12 version.

Suppose the data source is something like:
```javascript
    [
      { id: 1, role: 'IT', Employee { id: 222, SSN: 344-23-0000 }, code: 3333  },
      { id: 2, role: 'Sales', Employee { id: 333, SSN: 344-23-0001 }, code: 4444  },
      { id: 3, role: 'IT Manager', Employee { id: 444, SSN: 344-23-0002 }, code: 5555  },
      { id: 4, role: 'Security', Employee { id: 555, SSN: 344-23-0004 }, code: 6666  }

    ]
```


Example column schema for a selectDropdown type column:
```javascript
        { 
          title: "Employee Name"  ,
          data: 'employee.id', /* the key you want the selection to happen on.*/
          type: "selectDropdown",  /* this is the new type provided by this extension */ 
          selectOptions: dropdownLists.employeesList, /* The dropdown list as is */
          valueField: "EmployeeId", /* the field in data.employeesList that we get the option value from */
          textField: "EmployeeName",  /* the field in data.employeesList that we get the option text from */
          allowNull: true, /* if set to true, it will add an empty option to select from */
          width: 310
        }
```

Where dropdownLists.employeesList would be something like: 
```javascript
dropdownLists.employeesList = [
  { EmployeeId: 1, EmployeeName: 'David', SSN: 123-45-6789  },
  { EmployeeId: 2, EmployeeName: 'Jorge', SSN: 133-45-6789  },
  { EmployeeId: 3, EmployeeName: 'Alex', SSN: 153-45-6789  },
  { EmployeeId: 4, EmployeeName: 'Chelsea', SSN: 163-45-6789  },
  { EmployeeId: 5, EmployeeName: 'Sean', SSN: 173-45-6789  },
]
```
