var startRow = 1;
var excelData = [];
var mapCell = [
    {
        'cell': 'A',
        'key': 'name',
    },
    {
        'cell': 'B',
        'key': 'num',
    } 
];

$("#fileUploader").change(function(evt) {
    var selectedFile = evt.target.files[0];

    if (!selectedFile == false) {
        var XLreader = new FileReader();
        var XL_row_object = {};
        var workbook = null;
        var XLdata = null;

        XLreader.onload = function(event) {
            excelData = [];
            XLdata = event.target.result;
            workbook = XLSX.read(XLdata, {
                type: 'binary'
            });

            workbook.SheetNames.forEach(function(sheetName) {
                XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName], {
                    header: "A",
                    range: startRow-1,
                    defval: "",
                });
            });

            if(mapCell.length > 0){
                var mapCellKey = [];
                mapCell.forEach(function(v) {
                    mapCellKey[v.cell] = v.key;
                });
                
                XL_row_object = XL_row_object.map(function(val, index) {
                    var newArray = [];
                    for (var key in val) {
                        if(mapCellKey[key]){
                            newArray[mapCellKey[key]] = val[key];
                        }else{
                            newArray[key] = val[key];
                        }
                    }
                    return newArray;
                });
            }

            XL_row_object = XL_row_object.map(function(val, index) {
                var newArray = [];
                for (var key in val) {
                    if(mapCellKey[key]){
                        newArray[mapCellKey[key]] = val[key];
                    }else{
                        newArray[key] = val[key];
                    }
                }
                return Object.assign({}, newArray)
            });

            excelData = XL_row_object;
            console.log(excelData);

            var xxxx = {
                name: 'test',
                data: excelData
            };
            console.log(xxxx);

            $.ajax({
                type: 'POST',
                url: 'php.php',
                data: xxxx,
                dataType: 'json',
                cache: false,
                success: function(result) {
                    console.log(result);
                },
            });
        };

        XLreader.onerror = function(event) {
            console.error("File could not be read! Code " + event.target.error.code);
        };

        XLreader.readAsBinaryString(selectedFile);
    } else {
        console.log('Fail');
    }
});