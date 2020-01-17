import React from 'react';
import { Link } from 'react-router-dom';
import firebase from "firebase";
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import PublicIcon from '@material-ui/icons/Public';

const ListItemLink = ({primary, icon, to}) => {
    return (
        <li>
            <ListItem button component={Link} to={to}>
                <ListItemIcon>
                    {icon}
                </ListItemIcon>
                <ListItemText primary={primary} />
            </ListItem>
        </li>
    );
};

export const mainMenuItems = (
    <>
        <ListItemLink to="/profile"
                      primary="Profile"
                      icon={<PublicIcon />} />

        <li onClick={() => firebase.auth().signOut()}>
            <ListItem button >
                <ListItemIcon>
                    {<PublicIcon/>}
                </ListItemIcon>
                <ListItemText primary={"Logout"} />
            </ListItem>
        </li>
    </>
);

export const secondaryMenuItems = (
    <>
        <ListSubheader inset>Movies</ListSubheader>
        <ListItemLink to="/movies"
                      primary="Movies"
                      icon={<PublicIcon />} />
        <ListItemLink to="/editMovie"
                      primary="Create Movie"
                      icon={<PublicIcon />} />

        <ListSubheader inset>Genres</ListSubheader>
        <ListItemLink to="/genres"
                      primary="Genres"
                      icon={<PublicIcon />} />
        <ListItemLink to="/editGenre"
                      primary="Create Genre"
                      icon={<PublicIcon />} />
    </>
);