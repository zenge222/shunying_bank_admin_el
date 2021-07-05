const projectInfo = {
    state: {
        projectId: localStorage.getItem("projectId")
    },
    mutations: {
        setProjectId(state, data) {
            state.projectId = data;
        },
    },
    actions: {

    },
}
export default projectInfo;