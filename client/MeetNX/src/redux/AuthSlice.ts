import { createSlice,type PayloadAction } from "@reduxjs/toolkit";

interface authState{
    buttonDisabled:boolean,
    otpSent:boolean
}
const initialState: authState = {
    buttonDisabled: false,
    otpSent:false
};
const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers: {
        setButtonDisabled: (state, action: PayloadAction<boolean>) => {
          state.buttonDisabled = action.payload;
        },
        setOtpSent: (state, action: PayloadAction<boolean>) => {
            state.otpSent = action.payload;
          },
        },
          

})

export const { setButtonDisabled, setOtpSent } = authSlice.actions;
export default authSlice.reducer;