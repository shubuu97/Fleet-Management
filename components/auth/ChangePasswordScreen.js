import React from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { Text } from 'react-native-elements';
import t from 'tcomb-form-native';
import _set from 'lodash/set';
import _get from 'lodash/get';
import _cloneDeep from 'lodash/cloneDeep';
import { updatePassword, clearError, setLoadingFalse } from '../../actions/auth';
import theme from '../../theme';
import { Container, Content, Header, Button, Title, Body, Left, Right, Icon } from 'native-base';
import withLoadingScreen from '../withLoadingScreen';


const Form = t.form.Form;
const stylesheet = t.form.Form.stylesheet;

const ContainerWithLoading = withLoadingScreen(Container);

const ValidPassword = t.refinement(t.String, (n) => {
    if (n) {
        return validatePassword(n);
    }
});

function validatePassword(password) {
    let re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
    return re.test(String(password));
}

class ChangePasswordScreen extends React.Component {
    constructor(props) {
        super(props);
        this.samePassword = t.refinement(t.String, (s) => {
            return s == this.state.value.newPassword;
        });
        this.state = {
            value: {},
            isCondition: false,
        };
        this.Password = t.struct({
            oldPassword: ValidPassword,
            newPassword: ValidPassword,
            confirmPassword: this.samePassword,
        });
        this.validate = null;
        this.stylesheet = _cloneDeep(stylesheet);
    }

    static navigationOptions = {
        header: null,
    };

    componentDidMount() {
        this.props.setLoadingFalse();
        // if (this.props.auth.user) {
        //     if (this.props.auth.user.isVerified) {
        //         this.props.navigation.navigate('Home');
        //     } else {
        //         // pass
        //     }
        // }
    }
    componentWillUnmount() {
        this.props.clearError();
    }

    onChange = (value) => {
        this.setState({ value });
        if (value.confirmPassword != null && value.confirmPassword != '') {
            this.validate = this.refs.form.getValue();
        }
    }

    onPress = () => {
        const value = this.refs.form.getValue();
        let data = {};
        if (value) {
            _set(data, 'oldPassword', value.oldPassword);
            _set(data, 'newPassword', value.newPassword);
            this.props.updatePassword(data);
        } else {
            this.refs.form.getComponent('oldPassword').refs.input.focus();
        }
    }

    render() {
        const { error } = this.props;
        const options = {
            fields: {
                oldPassword: {
                    keyboardType: 'default',
                    autoFocus: true,
                    secureTextEntry: true,
                    label: 'Old Password',
                    error: 'Invalid Password. Atleast 4 digits.',
                    onSubmitEditing: () => this.refs.form.getComponent('newPassword').refs.input.focus()
                },
                newPassword: {
                    keyboardType: 'default',
                    secureTextEntry: true,
                    label: 'New Password',
                    error: 'Invalid Password. Atleast 4 digits.',
                    onSubmitEditing: () => this.refs.form.getComponent('confirmPassword').refs.input.focus()
                },
                confirmPassword: {
                    keyboardType: 'default',
                    autoFocus: false,
                    secureTextEntry: true,
                    label: 'Confirm Password',
                    error: 'Confirm password should match with new password.',
                    onSubmitEditing: () => this.onPress(),
                },
            },

        };


        return (
            <ContainerWithLoading style={theme.container} isLoading={this.props.isLoading}>
                <Header translucent={false} style={{ backgroundColor: '#4d47cd' }} androidStatusBarColor="#0e0a65" iosBarStyle="light-content">
                    <Left >
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name='arrow-back' style={{ color: '#fff' }} />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={{ color: '#fff' }} >Change Password</Title>
                    </Body>
                    <Right>
                    </Right>
                </Header>
                <Content>
                    <Text>{error}</Text>
                    <View style={[theme.marL15, theme.marR15, theme.mart15]} >
                        <Form
                            ref="form"
                            options={options}
                            type={this.Password}
                            value={this.state.value}
                            onChange={this.onChange}
                            style={[theme.formStyle]}
                        />
                    </View>
                </Content>
                <View style={{ backgroundColor: '#ffffff' }}>
                    <Button style={theme.buttonNormal} onPress={() => this.onPress()} full>
                        <Text style={theme.butttonFixTxt}>CHANGE PASSWORD</Text>
                    </Button>
                </View>
            </ContainerWithLoading>
        );
    }
}

function mapStateToProps(state) {
    let { auth } = state;
    let { userStatus } = auth || [];
    let { isLoading } = auth || false;
    let error = _get(auth, 'error.message', '');
    return {
        userStatus,
        auth,
        isLoading,
        error,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        clearError: () => dispatch(clearError()),
        setLoadingFalse: () => dispatch(setLoadingFalse()),
        updatePassword: data => dispatch(updatePassword(data)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangePasswordScreen);
