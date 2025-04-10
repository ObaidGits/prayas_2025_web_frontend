import { commonrequest } from "./ApiCall";

//<------------------------------------------- User Apis ------------------------------------------->
export const userSignUp = async(data, header)=>{
    return await commonrequest("POST", `/api/v1/users/register`, data, header);
}

export const userLogin = async(data, header)=>{
    return await commonrequest("POST", `/api/v1/users/login`, data, header);
}

export const getUser=async(data, header)=>{
    return await commonrequest("POST", `/api/v1/users/current-user`, data, header);
}

export const userLogout = async(data, header)=>{
  return await commonrequest("POST", `/api/v1/users/logout`, data, header);
}
//<------------------------------------------- Admin Apis ------------------------------------------->
export const adminSignUp = async(data, header)=>{
    return await commonrequest("POST", `/api/v1/admin/register`, data, header);
}

export const adminLogin = async(data, header)=>{
    return await commonrequest("POST", `/api/v1/admin/login`, data, header);
}

export const adminLogout = async(data, header)=>{
    return await commonrequest("POST", `/api/v1/admin/logout`, data, header);
}

export const getAdmin=async(data, header)=>{
  return await commonrequest("POST", `/api/v1/admin/current-admin`, data, header);
}

/*export const getAdmin = async (data, header) => {
  return await commonrequest("GET", `/api/v1/admin/current-admin`, data, {
    ...header,
    withCredentials: true // This ensures cookies are sent
  });
};*/


//<------------------------------------------- WebSOS Apis ------------------------------------------->
export const sendSOSLocation = async(data, header)=>{
    return await commonrequest("POST", `/api/v1/sos/`, data, header);
}


export const fetchActiveWebAlerts = async(data, header)=>{
  return await commonrequest("POST", `/api/v1/sos/active`, data, header);
}

export const fetchAllWebAlerts = async()=>{
  return await commonrequest("GET", `/api/v1/sos/all-alerts`, '', '');
}

export const markWebSosResolved = async(alert_id, header)=>{
  return await commonrequest("PUT", `/api/v1/sos/set-sos-resolved/${alert_id}`, '', header);
}

//<------------------------------------------- cctvSOS Apis ------------------------------------------->
export const fetchActiveCCTVAlerts = async(data, header)=>{
return await commonrequest("POST", `/api/v1/cctv/active`, data, header);
}

export const fetchAllCCTVAlerts = async()=>{
return await commonrequest("GET", `/api/v1/cctv/all-alerts`, '', '');
}

export const markCCTVSosResolved = async(alert_id, header)=>{
return await commonrequest("PUT", `/api/v1/cctv/set-sos-resolved/${alert_id}`, '', header);
}