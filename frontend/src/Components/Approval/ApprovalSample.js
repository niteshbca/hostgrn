
import React, { useEffect, useState } from 'react';
import styles from './Approval.module.css';
import axios from 'axios';
import TableComponent from '../Table/Table.rendering'
import LogOutComponent from '../LogOut/LogOutComponent';
export default function Sample({ managerType }) {
    const [visibleItem, setVisibleItem] = useState(null);
    const [selectedValue, setSelectedValue] = useState({});
    const [list, setList] = useState([]);
    const [gsnList, setGsnList] = useState([])
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [isHovered, setIsHovered] = useState(false);


    const [isGsnDataLoaded, setIsGsnDataLoaded] = useState(false);
    const [isListDataLoaded, setIsListDataLoaded] = useState(false);

    //mapping
    const managerFieldMap = {
        'General Manager': 'GeneralManagerSigned',
        'Store Manager': 'StoreManagerSigned',
        'Purchase Manager': 'PurchaseManagerSigned'
    };
    const fieldName = managerFieldMap[managerType];

    const url = process.env.REACT_APP_BACKEND_URL
    // Fetching data from API
    useEffect(() => {
        const fetchingGsnData = async () => {
            try {

                const token = localStorage.getItem('authToken')
                const resData = await axios.get(`${url}/gsn/getdata`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                const getData = resData.data;
console.log(getData)
                const fetchedList = getData.filter((u) => u.isHidden === false)

                // Set initial state of the checkboxes based on fetched data
                const initialSelectedValue = fetchedList.reduce((acc, item) => {

                    acc[item._id] = item[fieldName] === true ? 'checked' : 'not_checked';


                    return acc;
                }, {});


                setGsnList(getData);
                setSelectedValue(initialSelectedValue);
            } catch (err) {
                console.error("Error fetching data", err);
            }
        };
        fetchingGsnData();
    }, [])

    useEffect(() => {
        const fetchingData = async () => {
            try {

                const token = localStorage.getItem('authToken')
                const resData = await axios.get(`${url}/getdata`,
                    {
                        headers: { 
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                console.log("dnnc",resData)
                const data = resData.data;
                const fetchedList = data.filter((u) => u.isHidden === false)


                setList(fetchedList);
                // setSelectedValue(initialSelectedValue);
            } catch (err) {
                console.error("Error fetching data", err);
            }
        };
        fetchingData();
    }, [])
    // eslint-disable-next-line react-hooks/exhaustive-deps

    const showHandler = (index) => {
        setVisibleItem(visibleItem === index ? null : index);
    };

    // Handle form submission
    const handleSubmit = async (e, _Id) => {
        e.preventDefault();
        try {
            const url = process.env.REACT_APP_BACKEND_URL
            await axios.post(`${url}/verify`, {
                _Id,
                managerType,
                status: selectedValue[_Id] || 'not_checked'
            });
            alert('Verification status saved successfully');
        } catch (err) {
            console.error("Error saving verification status", err);
        }
    };
    useEffect(() => {
        if (isGsnDataLoaded && isListDataLoaded) {
            if (list.length <= gsnList.length) {
                list.length = gsnList.length
                console.log("length is", gsnList.length, list.length)
            }
        }
    }, [isGsnDataLoaded, isListDataLoaded])


    const formatDate = (oldFormat) => {
        const date = new Date(oldFormat);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'

        });
       
        return formattedDate
    }


    // Handle radio input change
    const handleRadioChange = (_Id, value) => {
        setSelectedValue(prev => ({ ...prev, [_Id]: value }));
    };

    return (
        <>
            <LogOutComponent />
            <div className={styles.outer}>

                {Array.from(gsnList).map((item, index) => {
                    const gsnItem = gsnList[index];
                    const defaultItem = {
                        _id: "0",
                        grinNo: false,
                        grinDate: "N/A",
                        gsn: "N/A",
                        gsnDate: "N/A",
                        poNo: "N/A",
                        poDate: "N/A",
                        partyName: "N/A",
                        innoviceno: "N/A",
                        innoviceDate: "N/A",
                        receivedFrom: "N/A",
                        lrNo: "N/A",
                        lrDate: "N/A",
                        transName: "N/A",
                        vehicleNo: "N/A",
                        file: "N/A",
                        GeneralManagerSigned: "N/A",
                        PurchaseManagerSigned: "N/A",
                        StoreManagerSigned: "N/A",
                        AccountManagerSigned: "N/A",
                        tableData: [],
                        createdAt: "N/A"
                    };
                    const filteredGsn = list.filter(u => u.gsn == item.gsn)
                    

                    const listItem = filteredGsn[0] || defaultItem;
                    console.log(listItem)
                    const {
                        _id,
                        grinNo,
                        grinDate,
                        gsn,
                        gsnDate,
                        poNo,
                        poDate,
                        partyName,
                        innoviceno,
                        innoviceDate,
                        receivedFrom,
                        lrNo,
                        lrDate,
                        transName,
                        vehicleNo,
                        file,
                        tableData,
                        createdAt
                    } = item;
                   
                    const materialList = Array.isArray(tableData) ? tableData : [];
                    const isButtonEnabled = grinNo && listItem.grinNo

                    return (

                        <div key={index} className={styles.show}>
                            <h2
                                style={{
                                    color: "black",
                                    // Add inline hover effect by changing style when isHovered is true
                                    // backgroundColor: isHovered ? "rgba(218, 216, 224, 0.6)" : "transparent",
                                    // padding: isHovered ? "25px" : '',
                                    cursor: "pointer",
                                    // boxShadow: isHovered ? "0px 4px 12px rgba(0,0,0,0.2)" : "none",
                                    // borderRadius: isHovered ? "8px" : "0",                  // Add border radius on hover
                                    transition: "all 0.3s ease",
                                    // transform: isHovered ? "scale(1.05)" : "scale(1)", 
                                    transition: "background-color 0.3s ease",
                                }}
                                onClick={() => showHandler(index)}
                                // onMouseEnter={() => setIsHovered(true)}
                                // onMouseLeave={() => setIsHovered(false)}
                            >
                                {partyName}
                            </h2>

                            <div style={{ display: "flex", flexDirection: "row" }}>

                                {/* 2 */}
                                <div className={styles.completeBlock} style={{ display: visibleItem === index ? 'block' : 'none' }}>
                                    <div className={styles.grinDetails}>
                                        <h1 style={{ textAlign: "center" }}>GSN</h1>
                                        <div><label htmlFor=""><h5>GRIN Details</h5></label></div>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>GRIN NO.</th>
                                                    <th>Date</th>
                                                    <th>GSN</th>
                                                    <th>Date</th>
                                                    <th>P.O. No.</th>
                                                    <th>Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>{grinNo}</td>
                                                    <td>{grinDate}</td>
                                                    <td>{gsn}</td>
                                                    <td>{gsnDate}</td>
                                                    <td>{poNo}</td>
                                                    <td>{poDate}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className={styles.grinDetails}>
                                        <label htmlFor=""><h5>Party Details</h5></label>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Party Name</th>
                                                    <th>Party Invoice No.</th>
                                                    {/* <th>Received From</th> */}
                                                    <th>Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>{partyName}</td>
                                                    <td>{innoviceno}</td>
                                                    {/* <td>{receivedFrom: }</td> */}
                                                    <td>{innoviceDate}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className={styles.grinDetails}>
                                        <label htmlFor=""><h5>Transport Details</h5></label>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>L.R. No.</th>
                                                    <th>Transporter Name</th>
                                                    <th>Vehicle No.</th>
                                                    <th>L.R. Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>{lrNo}</td>
                                                    <td>{transName}</td>

                                                    <td>{vehicleNo}</td>
                                                    <td>{lrDate}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    {/* Material Information */}
                                    {/* <div style={{border:"1px solid #ccc",width:"90%",margin:"2%",padding:"5px"}}>{materialInfo}</div> */}
                                    <div style={{
                                        border: "1px solid #ccc",
                                        width: "90%",
                                        margin: "2% auto",
                                        padding: "20px",
                                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                        borderRadius: "8px",
                                        backgroundColor: 'rgba(218, 216, 224, 0.6)',
                                        fontFamily: "'Arial', sans-serif",
                                        fontSize: "16px",
                                        lineHeight: "1.6",
                                        boxSizing: "border-box",
                                        maxWidth: "1200px",
                                        overflowWrap: "break-word",
                                    }}> <h5 style={{ textAlign: "center", alignItems: "center" }} >Material List</h5>

                                        {/* <TableComponent tableData={gsnItem ?gsnItem.tableData:"N/A"} /> */}
                                        <TableComponent tableData={Array.isArray(gsnItem?.tableData) ? gsnItem.tableData : []} />

                                    </div>

                                    {/* <div className="timestamp" style={{ textAlign: 'center' }}><h1>Created At</h1>{formattedDate}</div> */}

                                    <div className="timestamp" style={{
                                        textAlign: 'center',
                                        padding: '20px',
                                        backgroundColor: 'rgba(218, 216, 224, 0.6)',
                                        borderRadius: '10px',
                                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                        border: '1px solid #e0e0e0',
                                        margin: '20px auto',
                                        maxWidth: '400px',
                                        fontFamily: "'Roboto', sans-serif",
                                        color: '#333',
                                    }}>
                                        <h1 style={{
                                            fontSize: '24px',
                                            marginBottom: '10px',
                                            color: '#2c3e50',
                                            letterSpacing: '1px',
                                            textTransform: 'uppercase',
                                        }}>Created At</h1>
                                        <p style={{
                                            fontSize: '18px',
                                            fontWeight: 'bold',
                                            color: '#34495e',
                                        }}>{formatDate(createdAt)}</p>
                                    </div>






                                    <div style={{

                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        margin: "20px 0",
                                        padding: "15px",
                                        // backgroundColor: 'rgba(218, 216, 224, 0.6)',
                                        borderRadius: "8px",
                                        // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
                                    }}>
                                        <div style={{ textAlign: "center", }}>
                                            <h2 style={{
                                                color: "#007bff",
                                                fontSize: "24px",
                                                marginBottom: "10px",
                                                textDecoration: "underline"
                                            }}>Bill Details</h2>
                                            {file ? (
                                                // process.env.REACT_APP_BACKEND_URL
                                                <a href={`${url}/${file}`} target="_blank" rel="noopener noreferrer" style={{
                                                    display: "inline-block",
                                                    padding: "10px 20px",
                                                    backgroundColor: "#28a745",
                                                    color: "#fff",
                                                    textDecoration: "none",
                                                    borderRadius: "5px",
                                                    transition: "background-color 0.3s ease"
                                                }}
                                                    onMouseEnter={(e) => e.target.style.backgroundColor = "#218838"}
                                                    onMouseLeave={(e) => e.target.style.backgroundColor = "#28a745"}>
                                                    View/Download File
                                                </a>
                                            ) : (
                                                <p style={{ color: "#dc3545", fontSize: "18px" }}>No file available</p>
                                            )}
                                        </div>
                                    </div>




                                </div>
                                {/* 1st part */}
                                <div className={styles.completeBlock} style={{ display: visibleItem === index ? 'block' : 'none' }}>
                                    <div className={styles.grinDetails}>
                                        <h1 style={{ textAlign: "center" }}>GRIN</h1>
                                        <div><label htmlFor=""><h5>GRIN Details</h5></label></div>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>GRIN NO.</th>
                                                    <th>Date</th>
                                                    <th>GSN</th>
                                                    <th>Date</th>
                                                    <th>P.O. No.</th>
                                                    <th>Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>{listItem ? listItem.grinNo : 'N/A'}</td>
                                                    <td>{listItem ? listItem.grinDate : 'N/A'}</td>
                                                    <td>{listItem ? listItem.gsn : 'N/A'}</td>
                                                    <td>{listItem ? listItem.gsnDate : 'N/A'}</td>
                                                    <td>{listItem ? listItem.poNo : 'N/A'}</td>
                                                    <td>{listItem ? listItem.poDate : 'N/A'}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className={styles.grinDetails}>
                                        <label htmlFor=""><h5>Party Details</h5></label>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Party Name</th>
                                                    <th>Party Invoice No.</th>
                                                    {/* <th>Received From</th> */}
                                                    <th>Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>{listItem ? listItem.partyName : 'N/A'}</td>
                                                    <td>{listItem ? listItem.innoviceno : 'N/A'}</td>
                                                    {/* <td>{receivedFrom}</td> */}
                                                    <td>{listItem ? listItem.innoviceDate : 'N/A'}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className={styles.grinDetails}>
                                        <label htmlFor=""><h5>Transport Details</h5></label>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>L.R. No.</th>
                                                    <th>Transporter Name</th>
                                                    <th>Vehicle No.</th>
                                                    <th>L.R. Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>{listItem ? listItem.lrNo : 'N/A'}</td>
                                                    <td>{listItem ? listItem.transName : 'N/A'}</td>
                                                    <td>{listItem ? listItem.vehicleNo : 'N/A'}</td>
                                                    <td>{listItem ? listItem.lrDate : 'N/A'}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    {/* Material Information */}
                                    {/* <div style={{border:"1px solid #ccc",width:"90%",margin:"2%",padding:"5px"}}>{materialInfo}</div> */}
                                    <div style={{
                                        border: "1px solid #ccc",
                                        width: "90%",
                                        margin: "2% auto",
                                        padding: "20px",
                                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                        borderRadius: "8px",
                                        backgroundColor:"rgba(218, 216, 224, 0.6)",
                                        fontFamily: "'Arial', sans-serif",
                                        fontSize: "16px",
                                        lineHeight: "1.6",

                                        boxSizing: "border-box",
                                        maxWidth: "1200px",
                                        overflowWrap: "break-word",
                                    }}>
                                        <h5 style={{ textAlign: "center", alignItems: "center" }} >Material List</h5>

                                        <TableComponent tableData={listItem ? listItem.tableData : []} />
                                    </div>

                                    {/* <div className="timestamp" style={{ textAlign: 'center' }}><h1>Created At</h1>{formattedDate}</div> */}

                                    <div className="timestamp" style={{
                                        textAlign: 'center',
                                        padding: '20px',
                                        backgroundColor: 'rgba(218, 216, 224, 0.6)',
                                        borderRadius: '10px',
                                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                        border: '1px solid #e0e0e0',
                                        margin: '20px auto',
                                        maxWidth: '400px',
                                        fontFamily: "'Roboto', sans-serif",
                                        color: '#333',
                                    }}>
                                        <h1 style={{
                                            fontSize: '24px',
                                            marginBottom: '10px',
                                            color: '#2c3e50',
                                            letterSpacing: '1px',
                                            textTransform: 'uppercase',
                                        }}>Created At</h1>
                                        <p style={{
                                            fontSize: '18px',
                                            fontWeight: 'bold',
                                            color: '#34495e',
                                        }}>{formatDate(listItem ? (listItem.createdAt) : 'N/A')}</p>
                                    </div>






                                    <div style={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        margin: "20px 0",
                                        padding: "15px",
                                        // backgroundColor: "rgba(218, 216, 224, 0.6)",
                                        borderRadius: "8px",
                                        // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
                                    }}>
                                        <div style={{ textAlign: "center" }}>
                                            <h2 style={{
                                                color: "#007bff",
                                                fontSize: "24px",
                                                marginBottom: "10px",

                                                textDecoration: "underline"
                                            }}>Bill Details</h2>
                                            {listItem?.file ? (
                                                // process.env.REACT_APP_BACKEND_URL
                                                <a href={`${url}/${listItem.file}`} target="_blank" rel="noopener noreferrer" style={{
                                                    display: "inline-block",
                                                    padding: "10px 20px",
                                                    backgroundColor: "#28a745",
                                                    color: "#fff",
                                                    textDecoration: "none",
                                                    borderRadius: "5px",
                                                    transition: "background-color 0.3s ease"
                                                }}
                                                    onMouseEnter={(e) => e.target.style.backgroundColor = "#218838"}
                                                    onMouseLeave={(e) => e.target.style.backgroundColor = "#28a745"}>
                                                    View/Download File
                                                </a>
                                            ) : (
                                                <p style={{ color: "#dc3545", fontSize: "18px" }}>No file available</p>
                                            )}
                                        </div>
                                    </div>




                                </div>
                            </div>
                            {/* 3 */}
                            <div className={styles.sign}
                                style={{
                                    width: '90%',
                                    display: 'flex',
                                    margin: '5px',
                                    padding: '1px',
                                    // backgroundColor: 'rgba(218, 216, 224, 0.6)',
                                    animation: "gradientBG 10s ease infinite",
                                    flexDirection: windowWidth <= 600 ? "column" : "row",
                                    // boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                                    animation: 'fadeIn 1s ease',
                                    margin: windowWidth <= 600 ? '0' : '20px',
                                    justifyContent: 'center',
                                    alignItems: "center",
                                    // border: "1px solid #ccc",
                                    borderRadius: "12px"
                                }}>
                                <form onSubmit={(e) => handleSubmit(e, _id)} style={{ padding: '20px', display: 'flex', justifyContent: 'center', alignItems: "center" }}>
                                    <div className={styles.submission}>
                                        <div>
                                            <label htmlFor="Verify"><h6>Approve</h6></label>
                                            <input
                                                disabled={!isButtonEnabled}
                                                style={{
                                                    width: '12px', /* Adjust width */
                                                    height: '20px', /* Adjust height */
                                                    transform: 'scale(1.5)', /* Increase size */
                                                    cursor: 'pointer',
                                                    marginLeft: '10px'
                                                }}
                                                name={`checkbox-${index}`}
                                                value='checked'
                                                type="checkbox"
                                                onChange={() => handleRadioChange(_id, 'checked')}
                                                checked={selectedValue[_id] === 'checked'}
                                            />
                                        </div>
                                    </div>
                                    <button
                                        // disabled={!isButtonEnabled}

                                        type='submit'
                                        style={{
                                            width: '100%',
                                            maxWidth: '100px',
                                            margin: '5px',

                                            padding: "0 10px",
                                            minWidth: "80px",       // Increase padding for better touch interaction
                                            borderRadius: '15px',
                                            border: '2px solid transparent', // Solid border for better contrast
                                            backgroundColor: 'rgba(230, 216, 224, 0.8)',
                                            color: 'black',
                                            fontSize: '1rem',      // Relative font size for scalability
                                            transition: 'background-color 0.3s ease',  // Add smooth hover effect
                                        }}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = "#0056b3"}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = "rgba(218, 216, 224, 0.8)"}
                                    >Submit</button>
                                </form>
                            </div>

                        </div>

                    );
                })}
            </div>

        </>
    );
}






