
// try {
//    new gridjs.Grid({
//        columns: ["Name", "Email", "Phone Number"],
//        data: [
//        ["John", "john@example.com", "(353) 01 222 3333"],
//        ["Mark", "mark@gmail.com", "(01) 22 888 4444"],
//        ["Eoin", "eoin@gmail.com", "0097 22 654 00033"],
//        ["Sarah", "sarahcdd@gmail.com", "+322 876 1233"],
//        ["Afshin", "afshin@mail.com", "(353) 22 87 8356"]
//        ]
//    }).render(document.getElementById("wrapper-1"));
// } catch (e) {}

try {
    new gridjs.Grid({
        search: true,
        sort: true,
        columns: ["Name", "Email", "Phone Number"],
        data: [
        ["John", "john@example.com", "(353) 01 222 3333"],
        ["Mark", "mark@gmail.com", "(01) 22 888 4444"],
        ["Eoin", "eoin@gmail.com", "0097 22 654 00033"],
        ["Sarah", "sarahcdd@gmail.com", "+322 876 1233"],
        ["Afshin", "afshin@mail.com", "(353) 22 87 8356"]
        ]
    }).render(document.getElementById("wrapper-search"));
} catch (e) {}

try {
    new gridjs.Grid({
        search: true,
        sort: true,
        columns: ["Name", "Email", "Phone Number"],
        style: {
            table: {
            border: '3px solid #ccc'
            },
            th: {
                'background-color': 'rgba(0, 0, 0, 0.1)',
                color: '#000',
                'border-bottom': '3px solid #ccc',
                'text-align': 'center'
            },
            td: {
            'text-align': 'center'
            }
        },
        data: [
        ["John", "john@example.com", "(353) 01 222 3333"],
        ["Mark", "mark@gmail.com", "(01) 22 888 4444"],
        ["Eoin", "eoin@gmail.com", "0097 22 654 00033"],
        ["Sarah", "sarahcdd@gmail.com", "+322 876 1233"],
        ["Afshin", "afshin@mail.com", "(353) 22 87 8356"]
        ]
    }).render(document.getElementById("wrapper-search-style"));

} catch (e) {}
