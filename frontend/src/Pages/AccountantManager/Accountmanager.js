
import React, { useEffect, useState } from 'react';
import styles from '../../Components/Approval/Approval.module.css';
import axios from 'axios';
import TableComponent from '../../Components/Table/Table.rendering';
import LogOutComponent from '../../Components/LogOut/LogOutComponent';
export default function Accountant({ managerType }) {
    const [visibleItem, setVisibleItem] = useState(null);
    const [selectedValue, setSelectedValue] = useState({});
    const [list, setList] = useState([]);
    const [gsnList, setGsnList] = useState([])
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [isHovered, setIsHovered] = useState(false);


    const [isGsnDataLoaded, setIsGsnDataLoaded] = useState(false);
    const [isListDataLoaded, setIsListDataLoaded] = useState(false);

    //mapping
    managerType = 'Account Manager'
    const managerFieldMap = {
        'General Manager': 'GeneralManagerSigned',
        'Store Manager': 'StoreManagerSigned',
        'Purchase Manager': 'PurchaseManagerSigned',
        'Account Manager': 'AccountManagerSigned'
    };

    // fetching GSN data
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
                const gatData = resData.data;

                const fetchedList = gatData.filter((u) => u.isHidden === false)
                const fieldName = managerFieldMap[managerType];
                const initialSelectedValue = fetchedList.reduce((acc, item) => {
                    acc[item._id] = item[fieldName] === true ? 'checked' : 'not_checked';


                    return acc;
                }, {});

                setGsnList(gatData);
                setSelectedValue(initialSelectedValue);
                setIsGsnDataLoaded(true);

            } catch (err) {
                console.error("Error fetching data", err);
            }
        };
        fetchingGsnData();
    }, [])
    console.log("GSN list is", gsnList)
    // Fetching data from API
    useEffect(() => {
        const fetchingData = async () => {
            try {
                const token = localStorage.getItem('authToken')
                const url = process.env.REACT_APP_BACKEND_URL
                const resData = await axios.get(`${url}/getdata`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                const data = resData.data;
                setList(data);
                setIsListDataLoaded(true)
            } catch (err) {
                console.error("Error fetching data", err);
            }
        };
        fetchingData();
    }, []);
    // fetching gsn data
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
        console.log("time is", formattedDate)
        return formattedDate
    }
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
    const handleRadioChange = (_Id, value) => {
        setSelectedValue(prev => ({ ...prev, [_Id]: value }));
        console.log(selectedValue)
    };
    const url = process.env.REACT_APP_BACKEND_URL
    return (
        <>
            <LogOutComponent />
            <div className={styles.outer}>
                {Array.from(gsnList).map((item, index) => {
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
                        GeneralManagerSigned,
                        PurchaseManagerSigned,
                        StoreManagerSigned,
                        AccountManagerSigned,
                        tableData,
                        createdAt
                    } = item;
                    const materialList = Array.isArray(tableData) ? tableData : [];

                    const isAccountManagerEnabled = GeneralManagerSigned && PurchaseManagerSigned && StoreManagerSigned && grinNo && listItem.grinNo
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
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                            >
                                {partyName}
                            </h2>

                            {/* 1 */}
                            <div style={{ display: "flex", flexDirection: "row" }}>

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
                                                    <td>{(grinDate)}</td>
                                                    <td>{gsn}</td>
                                                    <td>{(gsnDate)}</td>
                                                    <td>{poNo}</td>
                                                    <td>{(poDate)}</td>
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
                                                    {/* <td>{receivedFrom}</td> */}
                                                    <td>{(innoviceDate)}</td>
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
                                                    <td>{(lrDate)}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    {/* Material Information */}
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
                                    }}>
                                        <h5 style={{ textAlign: "center", alignItems: "center" }} >Material List</h5>

                                        <TableComponent tableData={materialList} />
                                    </div>
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
                                        }}>{(createdAt)}</p>
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
                                        <div style={{ textAlign: "center" }}>
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
                                {/*2*/}

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
                                                    <td>{listItem ? (listItem.grinDate) : 'N/A'}</td>
                                                    <td>{listItem ? listItem.gsn : 'N/A'}</td>
                                                    <td>{listItem ? (listItem.gsnDate) : 'N/A'}</td>
                                                    <td>{listItem ? listItem.poNo : 'N/A'}</td>
                                                    <td>{listItem ? (listItem.poDate) : 'N/A'}</td>
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
                                                    <td>{listItem ? listItem.innoviceno : "N/A"}</td>
                                                    {/* <td>{listItem ? listItem.receivedFrom: 'N/A'}</td> */}
                                                    <td>{listItem ? (listItem.innoviceDate) : 'N/A'}</td>
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
                                                    <td>{listItem ? (listItem.lrDate) : 'N/A'}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    {/* Material Information */}
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

                                        {/* <TableComponent tableData={listItem ?listItem.tableData:"N/A"} /> */}
                                        <TableComponent tableData={listItem ? listItem.tableData : []} />

                                    </div>
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
                                        }}>{(listItem ? (listItem.createdAt) : 'N/A')}</p>
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
                                        <div style={{ textAlign: "center",
                                            
                                         }}>
                                            <h2 style={{
                                                color: "#007bff",
                                                fontSize: "24px",
                                                
                                                marginBottom: "10px",
                                                textDecoration: "underline"
                                            }}>Bill Details</h2>
                                            {listItem?.file ? (
                                                // process.env.REACT_APP_BACKEND_URL
                                                <a href={`${url}${listItem.file}`} target="_blank" rel="noopener noreferrer" style={{
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
                                   
                                    
                                }}
                            >
                                <form style={{ padding: '20px', display: 'flex', justifyContent: 'center', alignItems: "center" }} onSubmit={(e) => handleSubmit(e, _id)} >
                                    <div className={styles.submission} >
                                        <div>
                                            <label htmlFor="Verify"><h6>General Manager</h6></label>
                                            <input
                                                name={`checkbox-${index}`}
                                                style={{
                                                    width: '12px', /* Adjust width */
                                                    height: '20px', /* Adjust height */
                                                    transform: 'scale(1.5)', /* Increase size */
                                                    cursor: 'pointer',
                                                    marginLeft: '10px'
                                                }}
                                                value='checked'
                                                type="checkbox"
                                                checked={GeneralManagerSigned}
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="Verify"><h6>Store Manager</h6></label>
                                            <input
                                                name={`checkbox-${index}`}
                                                style={{
                                                    width: '12px',
                                                    height: '20px',
                                                    transform: 'scale(1.5)',
                                                    cursor: 'pointer',
                                                    marginLeft: '10px'
                                                }}
                                                value='checked'
                                                type="checkbox"

                                                checked={StoreManagerSigned} />
                                        </div>
                                        <div>
                                            <label htmlFor="Verify"><h6>Purchase Manager</h6></label>
                                            <input
                                                name={`checkbox-${index}`}
                                                style={{
                                                    width: '12px',
                                                    height: '20px',
                                                    transform: 'scale(1.5)',
                                                    cursor: 'pointer',
                                                    marginLeft: '10px'
                                                }}
                                                value='checked'
                                                type="checkbox"
                                                checked={PurchaseManagerSigned}
                                            />
                                        </div>
                                        {/* Accountant approvel */}
                                        <div>
                                            <label htmlFor="Verify"><h6>Account Manager</h6></label>
                                            <br />

                                            <input
                                                name={`checkbox-${index}`}
                                                style={{
                                                    width: '12px',
                                                    height: '20px',
                                                    transform: 'scale(1.5)',
                                                    cursor: 'pointer',
                                                    marginLeft: '10px'
                                                }}
                                                value='checked'
                                                type="checkbox"
                                                checked={selectedValue[_id] === 'checked'} onChange={() => handleRadioChange(_id, 'checked')}
                                                disabled={!isAccountManagerEnabled}
                                            />
                                        </div> <br />
                                        <div>

                                            <button disabled={!isAccountManagerEnabled}
                                                style={{
                                                    width: '100%',
                                                    maxWidth: '100px',
                                                    margin: '5px',
                                                    padding: "0 10px",
                                                    minWidth: "80px",
                                                    borderRadius: '15px',
                                                    border: '2px solid transparent',
                                                    backgroundColor: 'rgba(218, 216, 224, 0.8)',
                                                    color: 'white',
                                                    fontSize: '1rem',
                                                    transition: 'background-color 0.3s ease',
                                                }}
                                                onMouseEnter={(e) => e.target.style.backgroundColor = "#0056b3"}
                                                onMouseLeave={(e) => e.target.style.backgroundColor = "rgba(218, 216, 224, 0.8)"}
                                            >submit</button>
                                        </div>
                                    </div>

                                </form>
                            </div>
                        </div>
                    );
                })}
            </div>

        </>
    );
}





