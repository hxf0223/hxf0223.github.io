# frozen_string_literal: true

# Compatibility hook for legacy `mermaid: true` front matter.
# In al-folio v1.x (via al_charts gem), mermaid requires:
#   mermaid:
#     enabled: true
#     zoomable: true
# If a post specifies `mermaid: true` and contains a ```mermaid block,
# normalize it to the expected hash structure so diagrams render properly.
Jekyll::Hooks.register :site, :post_read do |site|
  (site.posts.docs + site.pages + site.documents).each do |doc|
    if doc.data['mermaid'] == true
      if doc.content =~ /```\s*mermaid/
        doc.data['mermaid'] = { 'enabled' => true, 'zoomable' => true }
      else
        doc.data['mermaid'] = false
      end
    end
  end
end
