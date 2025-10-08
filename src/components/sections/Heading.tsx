interface HeadingProps {
    Title: string,
    Paragraph: string
}

const Heading = ({ Title, Paragraph }: HeadingProps) => {
  return (
    <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">{Title}</h1>
        <p className="text-muted-foreground text-lg">
            {Paragraph}
        </p>
    </div>
  )
}

export default Heading