# select-dropdown-handsontable-extension
A select dropdown that accepts value-text pair.

Here is an example column defined in javascript:
```javascript
{ data: 'Employee.id', /* the key you want the selection to happen on.*/
  type: "selectDropdown",
  title: "Employee"  ,  
  selectOptions: [ 
                   { Value: "E58E7B63-D4E5-4B06-88B6-AF82B4346C90", Text: "John Smith"},
                   { Value: "DCB70E47-81ED-4ECD-9332-6245CC04B0B6", Text: "Kevin Smith"} ,
                   { Value: "04E0D9A9-2F94-4A31-98FA-8AFF0D900A7E", Text: "David Smith"}
                  ] /* the selectOption is an array of Value-Text objects */
}
```

