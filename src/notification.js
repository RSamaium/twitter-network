import {
    Notyf
} from "notyf";

export default new Notyf({
    duration: 30000,
    position: {
        x: 'center',
        y: 'top',
    },
    dismissible: true,
    types: [{
        type: "info",
        background: "#2185d0",
        icon: false,
        className: 'notyf-info',
        ripple: false
    }, {
        type: 'error',
        duration: 3000
    }]
});