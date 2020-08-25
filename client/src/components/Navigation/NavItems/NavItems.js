import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import "./NavItems.css";
import NavItem from "./NavItem/NavItem";
import * as actions from "../../../store/action/rootActions";

class NavItems extends Component {
   state = {
      showSubMenu: {},
      showAuthDropDrown: {},
      textInput: "",
   };

   showDropDown = () => {
      this.setState({ showSubMenu: { display: "block" } });
   };

   cancelDropdown = () => {
      this.setState({ showSubMenu: { display: "none" } });
   };

   showAuthDropDownFun = () => {
      this.setState({ showAuthDropDrown: { display: "block" } });
   };
   cancleAuthDropDrownFun = () => {
      this.setState({ showAuthDropDrown: { display: "none" } });
   };

   logOutFun = () => {
      this.setState({ showAuthDropDrown: { display: "none" } });
      this.props.onLogOut(this.props);
   };

   inputChangeHander = (event) => {
      this.setState({ textInput: event.target.value });
   };

   onClickHandler = () => {
      const value = this.state.textInput.toLowerCase();
      const splitValue = value.split(" ");
      this.props.history.replace("/ebooks/searched?_q=" + splitValue.join("-"));
      this.setState({ textInput: "" });
   };

   render() {
      let authNav = (
         <React.Fragment>
            <li
               className="Nav__Dropdown"
               onMouseOver={this.showAuthDropDownFun}
               onMouseLeave={this.cancleAuthDropDrownFun}
            >
               <NavItem link="#">{this.props.username}</NavItem>
               <ul
                  className="Nav__SubMenu"
                  style={this.state.showAuthDropDrown}
               >
                  <li onClick={this.cancleAuthDropDrownFun}>
                     <NavItem link="/add-ebook">Add Ebook</NavItem>
                  </li>
                  <li onClick={this.logOutFun}>
                     <NavItem link="#">Logout</NavItem>
                  </li>
               </ul>
            </li>
         </React.Fragment>
      );
      if (!this.props.username) {
         authNav = (
            <li>
               <NavItem link="/auth/signup">Register</NavItem>
            </li>
         );
      }

      return (
         <ul className="Nav">
            <div>
               <li>
                  <NavItem link="/" exact={true}>
                     Home
                  </NavItem>
               </li>
               <li
                  className="Nav__Dropdown"
                  onMouseOver={this.showDropDown}
                  onMouseLeave={this.cancelDropdown}
               >
                  <NavItem link="#">Categories</NavItem>
                  <ul className="Nav__SubMenu" style={this.state.showSubMenu}>
                     <li onClick={this.cancelDropdown}>
                        <NavItem link="/categories/web-development">
                           Web Development
                        </NavItem>
                     </li>
                     <li onClick={this.cancelDropdown}>
                        <NavItem link="/categories/web-design">
                           Web Design
                        </NavItem>
                     </li>
                     <li onClick={this.cancelDropdown}>
                        <NavItem link="/categories/database">Database</NavItem>
                     </li>
                     <li onClick={this.cancelDropdown}>
                        <NavItem link="/categories/programming">
                           Programming
                        </NavItem>
                     </li>
                  </ul>
               </li>
               <li>
                  <NavItem link="/contact">Contact Us</NavItem>
               </li>
            </div>
            <div className="LeftNav">
               <li>
                  <div className="searchForm">
                     <input
                        placeholder="Search ebooks"
                        value={this.state.textInput}
                        onChange={(e) => this.inputChangeHander(e)}
                     />
                     <button type="submit" onClick={this.onClickHandler}>
                        <i className="fas fa-search"></i>
                     </button>
                  </div>
               </li>
               {authNav}
            </div>
         </ul>
      );
   }
}

const stateToProps = (state) => {
   return {
      username: state.auth.username,
   };
};

const dispatchToProps = (dispatch) => {
   return {
      onLogOut: (props) => dispatch(actions.onLogOut(props)),
   };
};

export default connect(stateToProps, dispatchToProps)(withRouter(NavItems));
