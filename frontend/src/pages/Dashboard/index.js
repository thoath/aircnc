import React, { useEffect, useState, useMemo } from 'react';
import api from '../../services/api';
import {Link} from 'react-router-dom';
import socketio from 'socket.io-client';

import './style.css';

export default function Dashboard() {

    const [spots, setSpots] = useState([]);
    const [requests, setRequests] = useState([]);
    const user = localStorage.getItem('user');
  
    const socket = useMemo(() => socketio('http://192.168.0.109:3333', {
        query: { user },
    }), [user]);

    useEffect(() => {
        socket.on('booking_request', data => {
            setRequests([...requests, data]);
        });

    },[requests, socket]);

    useEffect(() => {
        async function loadSpots() {
            const user = localStorage.getItem('user');
            const response = await api.get('/dashboard', {
                headers: {user}
            });
            
            setSpots(response.data);
        }

        loadSpots();
    }, []);
    
    async function handleApprove(id) {
        
        await api.post(`/bookings/${id}/approvals`);

        setRequests(requests.filter(request => request._id !== id));
    }

    async function handleAReject(id) {

        await api.post(`/bookings/${id}/rejections`);

        setRequests(requests.filter(request => request._id !== id));
    }

    
    return (
        <>
            <ul className="notifications">
                {requests.map(request => (
                    <li key={request._id}>
                        <p>
                            <strong>{request.user.email}</strong> Está solicitando uma reserva em
                            <strong> {request.spot.company}</strong> para a data
                            <strong> {request.date}</strong>
                        </p>
                        <button className="accept" onClick={() => handleApprove(request._id)}>Aceitar</button>
                        <button className="reject" onClick={() => handleAReject(request._id)}>Rejeitar</button>    
                    </li>
                ))}        

            </ul>

            <ul className="spot-list">
                {spots.map(spot => (
                    <li key={spot._id}>
                        <header style={{ backgroundImage: `url(${spot.thumbnail_url})`}} />
                        <strong>
                            {spot.company}
                        </strong>
                        <span>
                            {spot.price ? `R$${spot.price}/dia` : 'GRÁTIS'}
                        </span>
                    </li>

                ))}

            </ul>
            
            <Link to="/new">
                <button className="btn"> Cadastrar novo Spot </button>
            </Link>

        </>

    )
}