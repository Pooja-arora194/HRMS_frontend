import React, { useEffect, useState, useMemo } from 'react';

const data = [
    {
        id: 1,
        comment: "Test Comment"
    },
    {
        id: 2,
        comment: "Second Comment",

    }

]

const Comment = () => {

    const [comments, setComments] = useState([]);
    const [subComments, setSubComments] = useState(new Map());
    const [commentText, setCommentText] = useState("");

    useEffect(() => {
        const commentsArr = [];
        const subCommentsMap = new Map();

        const setSubCommentsMap = (key, arr) => {
            if (arr === undefined) return;
            subCommentsMap.set(key, [...arr]);
            for (let i = 0; i < arr.length; i++) {
                const newKey = `${key},${i}`;
                setSubCommentsMap(newKey, arr[i].subComments)
            }
        }

        for (let i = 0; i < data.length; i++) {
            commentsArr.push(data[i].comment);
            let subComments = data[i].subComments;
            let key = i.toString();
            setSubCommentsMap(key, subComments)
        }

        setComments(commentsArr);
        setSubComments(subCommentsMap);
    }, []);

    const displayComments = useMemo(() => {

        const displaySubComments = (subCommentsArr, margin) => {
            return subCommentsArr.map((obj, index) => {
                return (
                    <span key={index} style={{ marginLeft: `${margin}rem`, display: 'block' }}>
                        {obj.comment}
                        {displaySubComments(subComments.get(`${index.toString()},${index}`) || [], margin + 2)}
                    </span>
                )
            })
        }

        return comments.map((ele, index) => {
            return (
                <div key={index}>
                    <span>
                        {ele}
                        {displaySubComments(subComments.get(index.toString()) || [], 2)}
                    </span>
                </div>
            )
        })
    }, [comments, subComments])

    const handleTextOnChange = (event) => {
        setCommentText(event.target.value);
    }

    return (
        <div>
            <div>
                <textarea type="textarea" value={commentText} onChange={handleTextOnChange} rows={5} cols={50} />
                <button type="button">Add Comment</button>
            </div>
            <div>
                {displayComments}
            </div>
        </div>
    )
}

export default Comment;