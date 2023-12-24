import { createStore } from 'vuex'
export default createStore({
    state() {
        return {
            currentUser: -1,
            name: '',
            isLogged: false,
        }
    },
    mutations: {
        setUser(state, user: number) {
            state.currentUser = user
        },
        setLogged(state, isLogged: boolean) {
            state.isLogged = isLogged
        },
        logout(state) {
            state.isLogged = false,
                state.currentUser = -1
            name: ''
        }
    }
})