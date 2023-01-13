import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Collapse from '@mui/material/Collapse';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import { styled } from '@mui/material/styles';
import { IconButtonProps } from '@mui/material/IconButton';
import MapsUgcIcon from '@mui/icons-material/MapsUgc';
import { DownOutlined } from '@ant-design/icons';
import  { MenuProps } from 'antd';
import { Dropdown, Space } from 'antd';
const drawerWidth = 340;


interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));


function Dashboard(props) {
    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    const bull = (
        <Box
            component="span"
            sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
        >
            •
        </Box>
    );


    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };


    const drawer = (
        <div>
            <Toolbar />
            <List>
                <img src="logo.png" ></img>
                <Divider className='nav_divider' />
                <div className='avatar'>
                    <Avatar className='avatar_img' alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                </div>
                <div className='profile_name'>
                    <h5 className='mt-4 '>Demo</h5>
                    <h5 className='mt-1'>#SICS40958</h5>
                </div>
                <div className='profile_details'>
                    <div className='row setting'>
                        <div className='col-sm-6'>
                            <h6>sdhfds</h6>
                            <h6>sdhfds</h6>
                            <h6>sdhfds</h6>

                        </div>
                        <div className='col-sm-6'>
                            <h6>aiue</h6>
                            <h6>aiue</h6>
                            <h6>aiue</h6>
                        </div>
                    </div>
                </div>
                <div className='logout_button'>
                    <button className='btn btn-primary'>Logout</button>
                </div>
            </List>
        </div >
    );


    const items: MenuProps['items'] = [
        {
          label: <h6>Edit </h6>,
          key: '0',
        },
        {
          label:  <h6>Delete </h6>,
          key: '1',
        },
        {
         
        },
      
      ];

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },

                }}
            >
                <Toolbar
                    className='main_header'
                >
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        Responsive drawer
                    </Typography>

                </Toolbar>

            </AppBar>

            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    className='left_nav'
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                    className='left_nav'

                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{ p: 3, width: { sm: `calc(100% - ${drawerWidth * 2}px)` } }}
            >
                <Toolbar />
                <div className='row'>
                    <div className='col-sm-10 announcement'>
                        <Typography>
                            Announcements
                        </Typography>
                    </div>
                    <div className='col-sm-2'>
                        <Typography>
                            <button className='btn btn-primary newpost_btn'>New Post</button>
                        </Typography>
                    </div>
                </div>

            

                <Card sx={{ maxWidth: 1100 ,marginTop:10 }}>
                    <CardHeader
                        avatar={
                            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                R
                            </Avatar>
                        }
                        action={
                                <Dropdown menu={{ items }} trigger={['click']}>
                                    <a onClick={(e) => e.preventDefault()}>
                                    
                                        <MoreVertIcon />
                                  
                                    </a>
                                </Dropdown>
                          
                        }className="post_style"
                        title="Shrimp and Chorizo Paella"
                        subheader="September 14, 2016"
                    />
                      
                    <CardContent>
                        <Typography variant="body2" color="text.secondary">
                            This impressive paella is a perfect party dish and a fun meal to cook
                            together with your guests. Add 1 cup of frozen peas along with the mussels,
                            if you like.
                        </Typography>
                    </CardContent>
                    <CardActions disableSpacing >
                        <IconButton aria-label="add to favorites" >
                            <FavoriteIcon />
                        </IconButton>
                        <IconButton aria-label="share">
                                <MapsUgcIcon/>
                        </IconButton>

                    </CardActions>

                </Card>




                <Card sx={{ maxWidth: 1100 ,marginTop:7 }}>
                    <CardHeader
                        avatar={
                            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                R
                            </Avatar>
                        }
                        action={
                            <Dropdown menu={{ items }} trigger={['click']}>
                                <a onClick={(e) => e.preventDefault()}>
                                
                                    <MoreVertIcon />
                              
                                </a>
                            </Dropdown>
                        }className="post_style"
                        title="Shrimp and Chorizo Paella"
                        subheader="September 14, 2016"
                    />
                      
                    <CardContent>
                        <Typography variant="body2" color="text.secondary">
                            This impressive paella is a perfect party dish and a fun meal to cook
                            together with your guests. Add 1 cup of frozen peas along with the mussels,
                            if you like.
                        </Typography>
                    </CardContent>
                    <CardActions className='icon_style'>
                        <IconButton aria-label="add to favorites">
                            <FavoriteIcon />
                        </IconButton>
                        <IconButton aria-label="share">
                                <MapsUgcIcon/>
                        </IconButton>

                    </CardActions>

                </Card>
            </Box>

            {/* Sidebar */}
            <Box
                component="sidebar"
                sx={{ width: { sm: drawerWidth } }}
                className="sidebar">
                <h4>Events</h4>
                <Card sx={{ minWidth: 200, marginTop: 4 }} className="card_events">
                    <CardContent>
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            Word of the Day
                        </Typography>

                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            adjective
                            <Divider className='event_divider' />
                        </Typography>

                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            Word of the Day
                        </Typography>

                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            adjective

                        </Typography>
                        <CreditCardIcon /> Add Reminder
                    </CardContent>
                </Card>


                <h4 className='mt-4'>Today</h4>
                <Card sx={{ minWidth: 200, marginTop: 4 }} className="card_events">
                    <CardContent>
                        <div className='row'>
                            <div className='col-sm-4'>
                                <Avatar className='avatar_img' alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                            </div>
                            <div className='col-sm-8'>
                                Word of the Day
                                Word of the Day
                            </div>
                        </div>


                    </CardContent>
                </Card>

                <Card sx={{ minWidth: 200, marginTop: 4 }} className="card_events">
                    <CardContent>
                        <div className='row'>
                            <div className='col-sm-4'>
                                <Avatar className='avatar_img' alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                            </div>
                            <div className='col-sm-8'>
                                Word of the Day
                                Word of the Day
                            </div>
                        </div>


                    </CardContent>
                </Card>

            </Box>

            {/* Sidebar end */}


        </Box>
    );
}

Dashboard.propTypes = {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
};

export default Dashboard;