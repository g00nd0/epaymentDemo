import AccountDetailsForm from "./AccountDetailsForm";
import "../../css/accountform.css";

const SignUp = (props) => {

    const setUser = props.setUser

    return (
        <div className="form-box">
            <div class="form-h1">
                <h1>Create new account</h1>
            </div>
            <AccountDetailsForm setUser={setUser} />
        </div>
    );
};


export default SignUp;
