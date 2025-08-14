import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null, // 사용자 정보 (email, nickname 등)
    isLoggedIn: false, // 로그인 여부
    isAdmin: false, // 관리자 여부 (email 기준)
    isAuthChecked: false, // 인증 체크 완료 여부
};

const authSlice = createSlice({
    name: 'auth', // store에서 state.auth로 연결되는 키가 됨
    initialState,
    reducers: {
        setUser(state, action) { // 로그인 성공 시 호출됨
            const userData = action.payload;
            // 아래 if문은 방어코드 userData.email을 읽을 수 없을때 방어코드를 만들어서 로그인 하도록 함
            // 외부에서 어떤 payload가 오더라도 최소한 에러 없이 동작하도록 보장
            // Header든 Login이든 잘못된 값을 보내도 여기서 앱 터지는 걸 막음
            if(!userData || !userData.email) {
                // 잘못된 payload면 무시하거나 초기화
                state.user = null;
                state.isLoggedIn = false;
                state.isAdmin = false;
                return;
            }
            state.user = userData; // user에 사용자 정보 저장
            state.isLoggedIn = true;
            state.isAdmin = userData.email === 'admin@example.com' // email === 'admin@example.com'이면 관리자 권한 부여
            state.isAuthChecked = true; // 인증 확인 완료 표시
        },
        logout(state) {
            state.user = null;
            state.isLoggedIn = false;
            state.isAdmin = false;
            state.isAuthChecked = true; // 인증 실패한 경우도 완료로 표시
        }
    }
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;