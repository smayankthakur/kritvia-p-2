import { PortableText } from '@portabletext/react';
import { urlFor } from '@/sanity/image';

// Define which types we want to render
const serializers = {
  types: {
    // Custom image serializer to handle Sanity images
    image: (props: any) => {
      const { value } = props;
      if (!value?.asset?._ref) {
        return <p>Invalid image</p>;
      }
      
      // Construct image URL from Sanity asset reference using the image URL builder
      const url = urlFor(value.asset?._ref)?.url();
      
      return (
        <figure>
          <img 
            src={url} 
            alt={value.alt || ''} 
            className="rounded-xl w-full h-auto object-cover mb-4"
          />
          {value.caption && (
            <figcaption className="mt-2 text-center text-sm text-neutral-500">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    // Custom code block serializer
    code: (props: any) => {
      const { value } = props;
      return (
        <div className="bg-neutral-800/50 p-4 rounded-lg overflow-x-auto mb-4">
          <pre className="text-sm">
            <code className="language-{value.language || 'plaintext'}">{value.code}</code>
          </pre>
        </div>
      );
    }
  }
};

export default function PortableTextRenderer({ value }: { value: any[] }) {
  if (!value || value.length === 0) {
    return <p className="text-neutral-400">No content available</p>;
  }
  
  return (
    <div className="prose prose-lg:prose-xl neutral">
      <PortableText 
        value={value} 
        components={serializers} 
      />
    </div>
  );
}