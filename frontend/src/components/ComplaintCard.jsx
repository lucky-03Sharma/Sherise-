export default function ComplaintCard({ data }) {
    return(
        <div>
            <h4> {data.type}</h4>
            <p>{data.description}</p>
                <p>Status : {data.status}</p>
        </div>
    );

} 