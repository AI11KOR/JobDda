import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../../api/axiosApi';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, logout } from '../../slices/authSlice';

const Header2 = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const { user, isAdmin, isLoggedIn } = useSelector((state) => state.auth);

    


    useEffect(() => {

    }, [location])

    return (
        <div>

        </div>
    )
}

export default Header2;