import React , { useState, useMemo } from 'react';
import camera from '../../assets/camera.svg';
import api from '../../services/api';
import './style.css';

export default function New({ history }) {

    const [company, setCompany] = useState('');
    const [techs, setTechs] = useState('');
    const [price, setPrice] = useState('');
    const [thumbnail,setThumbnail] = useState(null);
    const preview = useMemo(() => {
        return thumbnail ? URL.createObjectURL(thumbnail) : null;
    }, [thumbnail]
    );

    async function handleSubmit (e){
        e.preventDefault();

        const data = new FormData();
        const user = localStorage.getItem('user');

        data.append('thumbnail', thumbnail);
        data.append('techs', techs);
        data.append('price', price);
        data.append('company', company);

        await api.post('/spots', data, {
            headers: {user}
        });

        history.push('/dashboard');
    }

    return (
        <form onSubmit={handleSubmit}>

            <label 
                id="thumbnail" 
                style={{backgroundImage: `url(${preview})`}}
                className={thumbnail ? 'has-thumbnail' : ''}
            >
                
                <input type="file" onChange={event => setThumbnail(event.target.files[0])} />
                <img src={camera} alt="aircnc" />
            </label>

            <label htmlFor="company">Empresa *</label>
            <input 
                id="company"
                type="text"
                placeholder="Sua Empresa"
                value={company}
                onChange={event => setCompany(event.target.value)}
            />

            <label htmlFor="techs">Tecnologias *</label>
            <input 
                id="techs"
                type="text"
                placeholder="Tecnologias"
                value={techs}
                onChange={event => setTechs(event.target.value)}
            />

            <label htmlFor="price">Preço *</label>
            <input 
                id="price"
                type="text"
                placeholder="Preço por hora"
                value={price}
                onChange={event => setPrice(event.target.value)}
            />

            <button type="submit" className="btn">Cadastrar</button>

        </form>
    )
}